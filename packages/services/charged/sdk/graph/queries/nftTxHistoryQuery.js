import gql from 'graphql-tag';

import { nftTxHistoryFragment } from '../fragments/nftTxHistoryFragment';
import { nftTxCountFragment } from '../fragments/nftTxCountFragment';

export const nftTxHistoryQuery = gql`
  query nftTxHistoryQuery(
    $contractAddress: String!, 
    $tokenId: String!,
    $orderBy: String!, 
    $orderDirection: String!,
    $first: Int!,
    $skip: Int!,
  ) {
    nftTxHistories(
      where: { 
        contractAddress: $contractAddress, 
        tokenId: $tokenId 
      },
      orderBy: $orderBy, 
      orderDirection: $orderDirection,
      first: $first, 
      skip: $skip
    ) {
      ...nftTxHistoryFragment
    }

    nftTxCounts(
      where: { 
        contractAddress: $contractAddress, 
        tokenId: $tokenId 
      }
    ) {
      ...nftTxCountFragment
    }
  }
  ${nftTxHistoryFragment}
  ${nftTxCountFragment}
`;
