import gql from 'graphql-tag';

export const aaveProtocolQuery = gql`
  query aaveProtocolQuery {
    reserves (where: {
      liquidityRate_gte: 0
    }) {
      id
      symbol
      name
      decimals
      underlyingAsset
      liquidityRate
      liquidityIndex
      lastUpdateTimestamp

      price {
        priceInEth
        oracle {
          usdPriceEth
        }
      }

      aToken {
        id
        underlyingAssetAddress
        underlyingAssetDecimals
      }
    }
  }
`;
