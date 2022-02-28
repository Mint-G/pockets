import gql from 'graphql-tag';

export const totalValueLockedQuery = gql`
  query totalValueLockedQuery {
      assetTokenAnalytics {
        id
        totalAssetsLocked
        totalAssetsLockedAave
        totalAssetsLockedERC20
      }
    }
`;
