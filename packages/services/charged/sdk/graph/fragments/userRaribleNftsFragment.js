import gql from 'graphql-tag'

export const userRaribleFragment = gql`
  fragment userRaribleFragment on StandardNFT {
    tokenAddress
    tokenId
    owner
    metadataUri
    external_url
    name
    icon
    image
    description
  }
  `
