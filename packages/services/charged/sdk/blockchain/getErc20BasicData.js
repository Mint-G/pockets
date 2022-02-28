// TODO migrate
import * as _ from 'lodash';
import { multicall } from '../../blockchain/helpers/multicall'
const _contractFunctions = [
  { id: 'name', sig: 'name()(string)' },
  { id: 'symbol', sig: 'symbol()(string)' },
  { id: 'decimals', sig: 'decimals()(uint8)' },
];

export const getErc20ListBasicData = ({ contractAddresses, chainId }) => {
  return new Promise(async (resolve, reject) => {
    let batchCalls = [];

    _.forEach(contractAddresses, (address) => {
      const _calls = _.map(_contractFunctions, contractFn => ({
        target: address,
        call: [contractFn.sig],
        returns: [[contractFn.id, val => val]]
      }));
      batchCalls.push(_calls);
    });

    try {
      multicall({
        networkId: chainId,
        id: 'getErc20BasicData',
        batchCalls,
        watchMode: false,
        timeout: 60 * 1000,
        dispatch: async (updates) => {
          resolve(updates);
        },
      });
    }
    catch (err) {
      reject(err);
    }
  })
}
