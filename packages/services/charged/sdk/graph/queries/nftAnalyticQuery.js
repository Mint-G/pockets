import gql from 'graphql-tag';

import { nftAnalyticFragment } from '../fragments/nftAnalyticFragment';

export const nftAnalyticQuery = gql`
  query nftAnalyticQuery($nftAnalyticId: String!) {
    nftAnalytic(id: $nftAnalyticId) {
      ...nftAnalyticFragment
    }
  }
  ${nftAnalyticFragment}
`;
