import gql from 'graphql-tag'

export const genericNftBalanceFragment = gql`
  fragment genericNftBalanceFragment on GenericNftTokenBalance {
    id
    contractAddress
    tokenId

    nftTokenAddress
    nftTokenIds

    tokenBalances

    smartBasket {
      id
      address
      totalTokens
    }
  }
`
