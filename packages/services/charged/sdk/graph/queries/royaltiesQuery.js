import gql from 'graphql-tag';

export const royaltiesQuery = gql`
  query royaltiesQuery($address: String!) {
    userRoyalty(id: $address ) {
      claimableRoyalties
      royaltiesClaimed
    }
  }
`;
