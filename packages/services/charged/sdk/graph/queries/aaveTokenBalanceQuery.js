import gql from 'graphql-tag';

import { aaveTokenBalanceFragment } from '../fragments/aaveTokenBalanceFragment';

export const aaveTokenBalanceQuery = gql`
  query aaveTokenBalanceQuery($contractAddress: String!, $tokenIds: [String]!) {
    aaveAssetTokenBalances(where: { contractAddress: $contractAddress, tokenId_in: $tokenIds }) {
      ...aaveTokenBalanceFragment
    }
  }
  ${aaveTokenBalanceFragment}
`;
