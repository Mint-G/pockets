// Frameworks
import BlocknativeSdk from 'bnc-sdk';
import { createDfuseClient } from '@dfuse/client';
import * as _ from 'lodash';

// App Components
import Wallet from '../../wallets';
import { ChargedParticles } from './contracts';
import { getChainNameById } from '../../blockchain/helpers/getChainNameById';
import { GLOBALS } from '../../utils/globals';

// Queries
import { streamTransactionQuery } from '../graph/queries/StreamTransactionQuery';


// Transaction Events
const transactionEventMap = {
    'UPDATE_PARTICLE_TYPE': {   // find latest in logs for full record
        contract    : ChargedParticles,
        eventName   : 'ParticleTypeUpdated',
        method      : 'ParticleTypeUpdated(uint256,string,bool,bool,string,uint256,string)',
    },

    'UPDATE_PLASMA_TYPE': {   // find latest in logs for full record
        contract    : ChargedParticles,
        eventName   : 'PlasmaTypeUpdated',
        method      : 'PlasmaTypeUpdated(uint256,string,bool,uint256,string)',
    },

    'MINT_PARTICLE': {
        contract    : ChargedParticles,
        eventName   : 'ParticleMinted',
        method      : '',
    },

    'BURN_PARTICLE': {
        contract    : ChargedParticles,
        eventName   : 'ParticleBurned',
        method      : '',
    },
};


export const TRANSACTION_STATE_MSG = {
  'UNKNOWN'   : 'Transaction pooled and waiting to be included in a block...',
  'TX_INIT'   : 'Transaction created, monitoring has begun in the background...',
  'TX_PROMPT' : 'Creating Blockchain Transaction...',
  'IPFS_IMG'  : 'Saving Image to IPFS...',
  'IPFS_META' : 'Saving Metadata to IPFS...',
  'PENDING'   : 'Transaction pending block selection by miners...',
  'IN_BLOCK'  : 'Transaction has been included in a block for execution...',
  'REPLACED'  : 'Transaction replaced and has been re-pooled...',
  'CONFIRMED' : 'Transaction Completed, awaiting confirmations...',
  'COMPLETED' : {
    'default' : 'Transaction Completed Successfully!',
    'mint'    : 'NFT Minted!',
  },
};

const VALID_DFUSE_NETWORKS = [];//'mainnet', 'ropsten'];
const _txTimeouts = {};

class Transactions {

    constructor() {
        this.apiKey = GLOBALS.DFUSE_API_KEY;
        this.updateCache = null;
        this.txDispatch = null;
        this.networkId = GLOBALS.DEFAULT_CHAIN_ID;
        this.stream = null;
        this.client = null;
        this.cachedTxData = {};
        this.activeSearchId = null;
        this.currentTransitions = [];
        this.web3 = null;
    }

    static instance() {
        if (!Transactions.__instance) {
            Transactions.__instance = new Transactions();
        }
        return Transactions.__instance;
    }

    init({cachedTxData, updateCache, txDispatch}) {
        this.web3 = Wallet.instance().readOnlyWeb3;
        this.updateCache = updateCache;
        this.txDispatch = txDispatch;
        this.cachedTxData = cachedTxData;
    }

      // TODO L2: make sure this still works + naming makes sense when L2 contracts live
      connectToNetwork({ connectedNetworkId }) {
        const networkName = getChainNameById(connectedNetworkId);
        if (connectedNetworkId) { this.networkId = connectedNetworkId; }

        if (_.includes(VALID_DFUSE_NETWORKS, networkName)) {
          this.client = createDfuseClient({
              apiKey: this.apiKey,
              network: `${networkName}.eth.dfuse.io`,
              streamClientOptions: {
                  socketOptions: {
                      onClose: this.onConnectionClose,
                      onError: this.onConnectionError,
                  }
              }
          });
        } else {
          const networkId = connectedNetworkId ? connectedNetworkId : this.networkId; // new line added while migrating from GLOBAL.CHAIN_ID
          this.client = new BlocknativeSdk({
            dappId: GLOBALS.ONBOARD_DAPP_ID,
            networkId,
          });
        }
    }

    resumeIncompleteStreams() {
        if (_.isEmpty(this.cachedTxData)) { return; }
        const keys = _.keys(this.cachedTxData);
        for (const id of keys) {
          (async () => {
            await this.streamTransaction(this.cachedTxData[id]);
        })();
        }
    }

    clearSearch() {
        if (!this.txDispatch) { return; }
        this.txDispatch({type: 'CLEAR_SEARCH'});
    }

    clearLoad() {
        if (!this.txDispatch) { return; }
        this.txDispatch({type: 'CLEAR_LOAD'});
    }

    cancelSearch() {
        this.activeSearchId = null;
    }

    onConnectionClose() {
        // this.networkDispatch({type: 'DISCONNECTED_NETWORK', payload: {
        //     isNetworkConnected: false,
        //     networkErrors: []
        // }});
    }

    onConnectionError(error) {
        // this.networkDispatch({type: 'DISCONNECTED_NETWORK', payoad: {
        //     isNetworkConnected: false,
        //     networkErrors: ["Transactions: An error occurred with the socket.", JSON.stringify(error)]
        // }});
        console.error('Transactions.onError', error);
    }

    onStreamTransition({transition, extraData}) {
      this.currentTransitions = [...this.currentTransitions, transition];
      this.txDispatch({
        type: 'STREAM_TRANSITION', payload: {
          uuid: extraData.uuid,
          streamTransitions: this.currentTransitions.reverse(),
          extraData,
        }
      });
    }

    onStreamComplete({txHash, extraData}) {
      const uuid = extraData.uuid;
      delete this.cachedTxData[uuid];
      _txTimeouts[txHash] = 0;
      this.currentTransitions = [];
      this.updateCache('streamTxData', this.cachedTxData);
      this.txDispatch({type: 'UPDATE_RECENT_TXS', payload: {transactionHash: txHash, extraData: extraData}})
      this.txDispatch({type: 'STREAM_COMPLETE', payload: {
        uuid: extraData.uuid,
        streamTransitions: [{to: 'COMPLETE', transition: 'INIT', extraData, data: {txHash: txHash}}]
      }});
    }

    onStreamError({error,uuid}) {
      this.txDispatch({type: 'STREAM_ERROR', payload: {
        uuid,
        streamError: error
      }});
    }


    async streamTransaction({transactionHash, extraData}) {
        if (!this.txDispatch || !this.updateCache) { return; }

        const uuid = extraData.uuid;
        if (_.isEmpty(uuid)) {
          return;
        }

        const clonedCache = _.cloneDeep(this.cachedTxData);
        clonedCache[uuid] = {transactionHash, extraData};

        if (_.isEmpty(transactionHash)) {
          delete clonedCache[uuid];
          this.updateCache('streamTxData', clonedCache);
          return;
        }

        this.updateCache('streamTxData', clonedCache);

        this.txDispatch({type: 'BEGIN_STREAMING', payload: {
          uuid,
          transactionHash,
          streamTransitions: [{to: 'SUBMIT', transition: 'INIT', extraData}]
        }});

        const networkName = getChainNameById(this.networkId);
        if (_.includes(VALID_DFUSE_NETWORKS, networkName)) {
          return this.streamDFuse({transactionHash, extraData});
        } else {
          return this.streamGeneric({transactionHash, extraData});
        }
    }

    streamGeneric({transactionHash, extraData}) {
      const { emitter } = this.client.transaction(transactionHash);
      emitter.on('all', transaction => {
        if (_.includes(['txSent', 'txConfirmed'], transaction.eventCode)) {
          this.watchConfirmations({txHash: transactionHash, extraData});
        }
      });
    }

    async streamDFuse({transactionHash, extraData}) {
      let confirmations = 0;
      let count = 0;
      let forceEnd = false;

      let minConfirmations = GLOBALS.MIN_BLOCK_CONFIRMATIONS;
      if (_.get(extraData, 'txType', '') === 'approve') {
        minConfirmations = 1;
      }

      const streamOptions = {
        variables: {
          hash: transactionHash
        }
      };

      this.stream = await this.client.graphql(streamTransactionQuery, (message) => {
        if (message.type === 'error') {
          this.onStreamError({error: message.errors[0]['message']});
        }

        if (message.type === 'data') {
          const transition = {
            key         : `transition-${count}`,
            transition  : message['data']['transactionLifecycle']['transitionName'],
            from        : message['data']['transactionLifecycle']['previousState'],
            to          : message['data']['transactionLifecycle']['currentState'],
            data        : message['data']
          };
          count++;
          confirmations = _.get(transition, 'data.transactionLifecycle.transition.confirmations', 0);

          if (confirmations >= minConfirmations) {
            forceEnd = true;
          } else {
            this.onStreamTransition({transition, extraData});
          }
        }

        if (message.type === 'complete' || forceEnd) {
          this.onStreamComplete({txHash: transactionHash, extraData});
          this.stream.close();
        }
      }, streamOptions);

      await this.stream.join();
    }

    watchConfirmations({txHash, extraData}) {
      if (_txTimeouts[txHash] > 0) { return; }

      let minConfirmations = GLOBALS.MIN_BLOCK_CONFIRMATIONS;
      if (_.get(extraData, 'txType', '') === 'approve') {
        minConfirmations = 1;
      }

      _txTimeouts[txHash] = setTimeout(async () => {
        const currentBlock = await this.web3.eth.getBlockNumber();
        const confirmationCount = await this.getConfirmationCount({txHash, currentBlock});

        if (this.currentTransitions.length < confirmationCount) {
          const transition = {
            key         : `transition-${confirmationCount}`,
            transition  : 'CONFIRMED',
            from        : 'PENDING',
            to          : 'IN_BLOCK',
            data        : {
              hash: txHash,
              blockNumber: currentBlock,
              confirmations: confirmationCount
            }
          };
          this.onStreamTransition({transition, extraData});
        }

        if (confirmationCount < minConfirmations) {
          _txTimeouts[txHash] = 0;
          return this.watchConfirmations({txHash, extraData});
        }

        this.onStreamComplete({txHash, extraData});
      }, GLOBALS.GRAPH_FAST_POLL_INTERVAL)
    }

    async getConfirmationCount({txHash, currentBlock}) {
      const tx = (await this.web3.eth.getTransaction(txHash)) || {blockNumber: 0};
      return tx.blockNumber > 0 ? currentBlock - tx.blockNumber : 0;
    }





}
Transactions.__instance = null;

export default Transactions;
