import gql from 'graphql-tag';

import { userProtonsFragment } from '../fragments/userProtonsFragment';
import { aaveTokenBalanceFragment } from '../fragments/aaveTokenBalanceFragment';
import { genericTokenBalanceFragment } from '../fragments/genericTokenBalanceFragment';

export const marketProtonsQuery = gql`
  query marketProtonsQuery($contractAddress: String!) {
    protons: protonNFTs(first: 1000, where: { salePrice_gt: 0 }) {
      ...userProtonsFragment
    }
    aaveBalances: aaveAssetTokenBalances(first: 1000, where: { contractAddress: $contractAddress, principal_gt: 0 }) {
      ...aaveTokenBalanceFragment
    }
    genericBalances: genericAssetTokenBalances(first: 1000, where: { contractAddress: $contractAddress, principal_gt: 0 }) {
      ...genericTokenBalanceFragment
    }
  }
  ${userProtonsFragment}
  ${aaveTokenBalanceFragment}
  ${genericTokenBalanceFragment}
`;
