import _ from "lodash";
import GLOBALS from "../../utils/globals";

export const getSubgraphFromNetworkId = (networkId) => {
  const idNumber = Number(networkId);
  if (idNumber === 1) {
    return { fromMainnet: true };
  } else if (idNumber === 137) {
    return { fromPolygon: true };
  } else if (idNumber === 42) {
    return { fromKovan: true };
  } else if (idNumber === 80001) {
    return { fromMumbai: true };
  } else {
    return { fromUniverse: true };
  }
}

export const getAaveSubgraphFromNetworkId = (networkId) => {
  const idNumber = Number(networkId);
  switch (idNumber) {
    case 1:
      return { fromMainnetAave: true };
    case 137:
      return { fromPolygonAave: true };
    default:
      return { fromAave: true };
  }
}
