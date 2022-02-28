import gql from 'graphql-tag';

export const userLeptonsFragment = gql`
  fragment userLeptonsFragment on LeptonNFT {
    id
    tokenId
    lepton2 {
      id
    }
    owner
    price
    supply
    multiplier
    bonus
    metadataUri
    name
    description
    external_url
    animation_url
    youtube_url
    thumbnail
    image
    symbol
  }
`;
