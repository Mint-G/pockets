import gql from 'graphql-tag'

export const genericSmartWalletFragment = gql`
  fragment genericSmartWalletFragment on GenericSmartWallet {
    id
    contractAddress
    tokenId

    assetTokens
    assetBalances {
      id
      assetToken
      name
      symbol
      decimals
      principal
    }
  }
`
