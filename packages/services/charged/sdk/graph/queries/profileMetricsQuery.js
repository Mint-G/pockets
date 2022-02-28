import gql from 'graphql-tag';

export const profileMetricsQuery = gql`
  query profileMetricsQuery {
    profileMetrics(first:1000) {
      id
      totalEthEarned
      buyProtonCount
      sellProtonCount
      mintProtonCount
      buyLeptonCount
      transferLeptonCount
      energizeAaveCount
      energizeERC20Count
      dischargeInterestCount
      releaseMassCount
      royaltiesClaimedCount
    }
  }
`;
