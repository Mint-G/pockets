import gql from 'graphql-tag'

export const nftTxCountFragment = gql`
  fragment nftTxCountFragment on NftTxCount {
    id
    contractAddress
    tokenId
    count
  }
`
