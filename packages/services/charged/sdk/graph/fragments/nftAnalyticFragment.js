import gql from 'graphql-tag'

export const nftAnalyticFragment = gql`
  fragment nftAnalyticFragment on NftAnalytic {
    tokenId

    numSales
    totalRoyalties
    totalSalesVolume
  }
`
