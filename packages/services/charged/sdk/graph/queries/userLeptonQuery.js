import gql from 'graphql-tag';

import { userLeptonsFragment } from '../fragments/userLeptonsFragment';

export const userLeptonsQuery = gql`
  query userLeptonsQuery($address: String!) {
    leptonNFTs(where: { owner: $address, lepton2_not: null }) {
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
  }
  ${userLeptonsFragment}
`;
