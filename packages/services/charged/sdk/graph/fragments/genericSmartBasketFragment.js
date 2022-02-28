import gql from 'graphql-tag'

export const genericSmartBasketFragment = gql`
  fragment genericSmartBasketFragment on GenericSmartBasket {
    id
    contractAddress
    tokenId

    totalTokens
    tokenBalances {
      id
      nftTokenAddress
      nftTokenIds
    }
  }
`
