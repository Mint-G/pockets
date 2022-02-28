import gql from 'graphql-tag'

export const universeDefaultFragment = gql`
  fragment universeDefaultFragment on Universe {
    id
    owner

    chargedParticles {
      id
      owner

      chargedSettings {
        depositCaps {
          id
          assetToken
          maxDeposit
        }
        tempLockExpiryBlocks

        genericBasketManager {
          id
          name
          address
          paused
        }

        genericWalletManager {
          id
          name
          address
          paused
        }

        aaveWalletManager {
          id
          name
          address
          paused
        }
      }
    }

    ionxToken {
      id
    }
    ionxMaxSupply

    esaMultiplier {
      id
      assetToken
      multiplier
    }
  }
`
