import gql from 'graphql-tag';

import { userExternalNftsFragment } from '../fragments/userExternalNftsFragment';

export const userExternalNftsQuery = gql`
  query userOwnedNftsQuery(
    $userAddress: String!,
  ) {
    ownedExternalNfts: standardNFTs(where: { owner: $userAddress }) {
      ...userExternalNftsFragment
    }
  }
  ${userExternalNftsFragment}
`;

export const singleTokenQuery = gql`
  query singleTokenQuery(
    $tokenId: String!,
    $tokenAddress: String!,
  ) {
    nftData: standardNFTs(first: 1, where: { tokenId: $tokenId, tokenAddress: $tokenAddress}) {
      ...userExternalNftsFragment
    }
    _meta {
      block {
        number
        hash
      }
    }
  }
  ${userExternalNftsFragment}
`;
