import gql from 'graphql-tag'

export const genericTokenBalanceFragment = gql`
  fragment genericTokenBalanceFragment on GenericAssetTokenBalance {
    id
    assetToken
    contractAddress
    tokenId

    name
    symbol
    decimals
    principal

    smartWallet {
      id
      address
    }
  }
`
