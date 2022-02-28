import gql from 'graphql-tag';

export const platformMetricsQuery = gql`
  query platformMetricsQuery {
    platformMetrics {
      id
      platformEthEarned
      platformProtonsMinted
      platformInterestDischarged
    }
  }
`;
