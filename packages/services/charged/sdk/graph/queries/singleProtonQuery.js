import gql from 'graphql-tag';
import { userProtonsFragment } from '../fragments/userProtonsFragment';


export const singleProtonQuery = gql`
  query singleProtonQuery($tokenId:String!) {
    proton: protonNFTs(first:1, skip:0, where: { tokenId: $tokenId }){
      ...userProtonsFragment
    }
    _meta {
      block {
        number
        hash
      }
    }
  }
  ${userProtonsFragment}
`;
