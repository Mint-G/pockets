import gql from 'graphql-tag'

export const nftTxHistoryFragment = gql`
  fragment nftTxHistoryFragment on NftTxHistory {
    id
    contractAddress
    tokenId
    timestamp
    eventType
    eventData
  }
`
