import gql from 'graphql-tag';

import { aaveSmartWalletFragment } from '../fragments/aaveSmartWalletFragment';
import { genericSmartWalletFragment } from '../fragments/genericSmartWalletFragment';
import { genericSmartBasketFragment } from '../fragments/genericSmartBasketFragment';

export const nftBalanceQuery = gql`
  query nftBalanceQuery(
    $contractAddress: String!,
    $tokenIds: [String]!
  ) {
    aaveSmartWallets(
      where: {
        contractAddress: $contractAddress,
        tokenId_in: $tokenIds
      },
    ) {
      ...aaveSmartWalletFragment
    }

    genericSmartWallets(
      where: {
        contractAddress: $contractAddress,
        tokenId_in: $tokenIds
      }
    ) {
      ...genericSmartWalletFragment
    }

    genericSmartBaskets(
      where: {
        contractAddress: $contractAddress,
        tokenId_in: $tokenIds
      }
    ) {
      ...genericSmartBasketFragment
    }
    _meta {
      block {
        number
        hash
      }
    }
  }
  ${aaveSmartWalletFragment}
  ${genericSmartWalletFragment}
  ${genericSmartBasketFragment}
`;
