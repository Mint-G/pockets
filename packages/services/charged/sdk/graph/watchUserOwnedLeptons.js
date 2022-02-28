// Frameworks
import Web3 from 'web3';
import * as _ from 'lodash';

import { multicall } from '../../blockchain/helpers/multicall';
import { Helpers } from '../../utils/helpers';
import { GLOBALS } from '../../utils/globals';

export const watchUserOwnedLeptons = ({
  userAddress,
  operatorAddress,
  userDataDispatch,
  dispatch,
  connectedNetworkId
}) => {
  if (_.isEmpty(userAddress)) {
      return;
  }

  const balanceOfCall = [{
      target: operatorAddress,
      call: ['balanceOf(address)(uint256)', userAddress],
      returns: [
          [`balanceOf-${operatorAddress}-leptons`, val => ({
              bn: Web3.utils.toBN(val),
              str: Helpers.formatBigNumber(val, 0),
          })]
      ]
  }];

  const watchMode = true;
  const interval = GLOBALS.GRAPH_LONG_POLL_INTERVAL;

  const onLeptonsBalanceChanged = (updates) => {
      const balance = _.get(updates,`${operatorAddress}.balanceOf.str`);
      if (balance) {
        userDataDispatch({
          type: 'UPDATE_LEPTON_BALANCE',
          payload: balance
        });
      }
      dispatch(updates);
  };

  const leptonsBalanceOfWatcher = multicall({
    networkId: connectedNetworkId,
    id: 'watchUserOwnedLeptons',
      batchCalls:balanceOfCall,
      watchMode,
      interval,
      dispatch: async (updates) => {
          const newUpdates = {};
          _.forEach(updates, update => {
              const [type, address] = update.type.split('-');
              newUpdates[address] = newUpdates[address] || {};
              newUpdates[address][type] = update.value;
          });
          onLeptonsBalanceChanged(newUpdates);
      }
  });

  return leptonsBalanceOfWatcher;
};
