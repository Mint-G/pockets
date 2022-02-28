import gql from 'graphql-tag';

import { universeDefaultFragment } from '../fragments/universeDefaultFragment';

export const universeDefaultQuery = gql`
  query universeDefaultQuery($address: String!) {
    universes(where: { id: $address }) {
      ...universeDefaultFragment
    }
  }
  ${universeDefaultFragment}
`;
