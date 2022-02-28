import gql from 'graphql-tag';

import { userProtonsFragment } from '../fragments/userProtonsFragment';

export const userProtonQuery = gql`
  query userProtonQuery(
    $userAddress: String!,
    $ownedFirst: Int!,
    $ownedSkip: Int!,
    $createdFirst: Int!,
    $createdSkip: Int!,
  ) {
    ownedProtons: protonNFTs(first: $ownedFirst, skip: $ownedSkip, where: { owner: $userAddress }) {
      ...userProtonsFragment
    }

    createdProtons: protonNFTs(first: $createdFirst, skip: $createdSkip, where: { creator: $userAddress }) {
      ...userProtonsFragment
    }

    protonCounts: protonNftCounts(where: { id: $userAddress }) {
      createdCount
      ownedCount
    }
  }
  ${userProtonsFragment}
`;
