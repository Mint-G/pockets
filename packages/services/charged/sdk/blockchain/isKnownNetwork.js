import * as _ from 'lodash';
import { GLOBALS } from '../../utils/globals';

const _SUPPORTED_CHAIN_IDS = _.map(GLOBALS.SUPPORTED_NETWORKS, (network) => network.chainId);

export const isKnownNetwork = (chainId) => _SUPPORTED_CHAIN_IDS.includes(Number(chainId));
