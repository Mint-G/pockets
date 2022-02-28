import gql from 'graphql-tag'

export const userExternalNftsFragment = gql`
  fragment userExternalNftsFragment on StandardNFT {
    tokenAddress
    tokenId
    owner
    metadataUri
  }
  `
