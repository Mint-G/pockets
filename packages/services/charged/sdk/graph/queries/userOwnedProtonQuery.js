import gql from 'graphql-tag';

import { userProtonsFragment } from '../fragments/userProtonsFragment';

export const userOwnedProtonQuery = gql`
  query userOwnedProtonQuery($userAddress: String!) {
    protonNFTs(first: 20, where: { owner: $userAddress }) {
      ...userProtonsFragment
    }
  }
  ${userProtonsFragment}
`;
