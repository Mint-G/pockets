import gql from 'graphql-tag';

export const leptonsQuery = gql`
  query leptonsQuery($paused: Boolean!) {
    lepton2S(where: {paused: $paused}) {
      id
      paused
      totalMinted
      typeIndex
      maxSupply
      maxMintPerTx
      types {
        id
        metadataUri
        price
        supply
        multiplier
        bonus
        upperBounds
      }
    }
  }
`;
