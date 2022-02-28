import gql from 'graphql-tag'

export const aaveTokenBalanceFragment = gql`
  fragment aaveTokenBalanceFragment on AaveAssetTokenBalance {
    id
    assetToken
    contractAddress
    tokenId

    principal
    ownerInterestDischarged
    creatorInterestDischarged

    smartWallet {
      id
      address
      nftCreator
      nftCreatorAnnuityPct
      nftCreatorAnnuityRedirect
    }
  }
`
