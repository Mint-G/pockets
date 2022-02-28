// Frameworks
import * as _ from 'lodash';
import { multicall } from '../../blockchain/helpers/multicall';

import { GLOBALS } from '../../utils/globals';
import { getContractAddress } from './contracts';

export const getParticleChargeBatched = ({
  tokenContractAddress,
  tokenId,
  managerId = GLOBALS.DEFAULT_YIELD_PROVIDER,
  reserveAssets = [], // [{underlyingAsset}],
  connectedNetworkId
}) => {
  return new Promise(async (resolve) => {
    let batchCalls = [];

    const chargedParticlesAddress = getContractAddress('ChargedParticles', connectedNetworkId);

    if (!_.isEmpty(reserveAssets)) {
      batchCalls = _.flatMap(reserveAssets, reserveAsset => {
        return [
          {
            target: chargedParticlesAddress,
            call: [
              'baseParticleMass(address,uint256,string,address)(uint256)',
              tokenContractAddress,         // address contractAddress,
              tokenId,                      // uint256 tokenId,
              managerId,                    // string managerId,
              reserveAsset.underlyingAsset, // address assetToken
            ],
            returns: [[`mass-${reserveAsset.underlyingAsset}`, val => val]]
          },
          {
            target: chargedParticlesAddress,
            call: [
              'currentParticleCharge(address,uint256,string,address)(uint256)',
              tokenContractAddress,         // address contractAddress,
              tokenId,                      // uint256 tokenId,
              managerId,                    // string managerId,
              reserveAsset.underlyingAsset, // address assetToken
            ],
            returns: [[`charge-${reserveAsset.underlyingAsset}`, val => val]]
          }
        ];
      });
    }

    if (!_.isEmpty(batchCalls)) {
      //console.log('Starting batch call on',{batchCalls});
      const watcher = multicall({networkId: connectedNetworkId, id: 'getParticleChargeBatched', watchMode: false, timeout: 60 * 1000, batchCalls, dispatch: async (updates) => {
        const charges = {};
        _.forEach(updates, chargeData => {
          if (chargeData.value.gt(0)) {
            const [callType, assetAddress] = _.get(chargeData, 'type', '').split('-');
            charges[assetAddress] = charges[assetAddress] || {};
            charges[assetAddress][callType] = chargeData.value;
          }
        });

        resolve(charges);
      }});

      watcher.onError((err) => {
        console.warn(err);
        resolve({loading: false, error: err, data: []});
      });

    } else {
      resolve({loading: false, error: null, data: []});
    }
  });
};
