import gql from 'graphql-tag';

import { userProfileDataFragment } from '../fragments/userProfileDataFragment';

export const userProfileDataQuery = gql`
  query userProfileDataQuery(
    $userAddress: String!,
  ) {
    wbosons(where: { account: $userAddress }) {
      ...userProfileDataFragment
    }
  }
  ${userProfileDataFragment}
`;
