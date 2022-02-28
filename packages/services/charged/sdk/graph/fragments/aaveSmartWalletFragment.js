import gql from 'graphql-tag'

export const aaveSmartWalletFragment = gql`
  fragment aaveSmartWalletFragment on AaveSmartWallet {
    id
    contractAddress
    tokenId

    address
    nftCreator
    nftCreatorAnnuityPct
    nftCreatorAnnuityRedirect

    assetBalances {
      id
      assetToken
      name
      symbol
      decimals
      principal
      ownerInterestDischarged
      creatorInterestDischarged
    }
  }
`
