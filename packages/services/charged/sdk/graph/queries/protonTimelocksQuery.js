import gql from 'graphql-tag';

// Todo: Decide on $tokenId type globally to not have mix of Int / String
//       for the same field

export const protonTimelocksQuery = gql`
  query protonTimelocksQuery($contractAddress: String!, $tokenId: String!) {
    nftStates(where: {contractAddress: $contractAddress, tokenId: $tokenId}) {
      id
      tokenId
      dischargeTimelockExpiry
      dischargeTimelockLockedBy

      releaseTimelockExpiry
      releaseTimelockLockedBy

      breakBondTimelockExpiry
      breakBondTimelockLockedBy

      tempLockExpiry
    }
    _meta {
      block {
        number
        hash
      }
    }
  }
`;
