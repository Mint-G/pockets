import gql from 'graphql-tag'

export const userProtonsFragment = gql`
  fragment userProtonsFragment on ProtonNFT {
    id
    tokenId
    owner
    creator
    metadataUri

    particleType
    creatorAnnuity

    salePrice
    lastSalePrice
    resaleRoyalties
    resaleRoyaltiesRedirect

    name
    description
    external_url
    animation_url
    youtube_url
    icon
    image
    thumbnail
    symbol
    decimals
    background_color
    attributes {
      name
      value
    }
  }
`
