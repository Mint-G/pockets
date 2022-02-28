import * as _ from 'lodash'
import { Helpers } from '../../utils/helpers'

// format the prefetch Erc721AssetData
export const formatErc721AssetData = (assetData, excludedContracts = [], excludedIds = []) => {
    return _.compact(_.map(assetData, (data) => {
      const contractName = _.get(data, 'contract_name', '');
      const contractAddress = _.get(data, 'contract_address', '');
      if (_.isEmpty(contractAddress) || _.includes(excludedContracts, _.toLower(contractAddress))) { return; }

      const nfts = _.compact(_.map(_.get(data, 'nft_data', []), (nft) => {
        const nftId = _.get(nft, 'token_id', '');
        if (_.isEmpty(nftId) || _.includes(excludedIds, _.toLower(nftId))) { return; }

        const nftIdStr = Helpers.getFriendlyTokenId(nftId);
        const nftName = _.get(nft, 'external_data.name', nftIdStr);
        return {
          label: nftName,
          value: nftId,
          type: 'nft',
          'contract_name': contractName,
          'contract_address': contractAddress,
          ...nft,
        };
      }));

      return {
        label: contractName, // `${contractName} (${contractSymbol})`,
        options: [...nfts],
        ...data,
      };
    }));
  };
