import gql from 'graphql-tag';

import { userProtonsFragment } from '../fragments/userProtonsFragment';
import { aaveTokenBalanceFragment } from '../fragments/aaveTokenBalanceFragment';
import { genericTokenBalanceFragment } from '../fragments/genericTokenBalanceFragment';

export const notForSaleMarketQuery = gql`
  query marketProtonsQuery($contractAddress: String!, $tokenIds: [Int]!) {
    protons: protonNFTs(first: 1000, where: { tokenId_in: $tokenIds }) {
      ...userProtonsFragment
    }
    aaveBalances: aaveAssetTokenBalances(first: 1000, where: { contractAddress: $contractAddress, tokenId_in: $tokenIds }) {
      ...aaveTokenBalanceFragment
    }
    genericBalances: genericAssetTokenBalances(first: 1000, where: { contractAddress: $contractAddress, tokenId_in: $tokenIds }) {
      ...genericTokenBalanceFragment
    }
  }
  ${userProtonsFragment}
  ${aaveTokenBalanceFragment}
  ${genericTokenBalanceFragment}
`;
