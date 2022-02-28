// Frameworks
import * as _ from 'lodash';

// App Components
import { ContractFactory } from '../../blockchain/contract-factory';
import { GLOBALS } from '../../utils/globals';

// Contract Data
const ChargedParticlesAbi = require('@charged-particles/protocol-subgraph/abis/ChargedParticles');
const ChargedStateAbi = require('@charged-particles/protocol-subgraph/abis/ChargedState');
const ProtonAbi = require('@charged-particles/protocol-subgraph/abis/Proton');
const LeptonAbi = require('@charged-particles/protocol-subgraph/abis/Lepton');
const Lepton2Abi = require('@charged-particles/protocol-subgraph/abis/Lepton2');
const WBosonAbi = require('@charged-particles/protocol-subgraph/abis/WBoson');
const Erc721Abi = require('@charged-particles/protocol-subgraph/abis/ERC721');

const mainnetAddresses = require('@charged-particles/protocol-subgraph/networks/mainnet');
const kovanAddresses = require('@charged-particles/protocol-subgraph/networks/kovan');
const polygonAddresses = require('@charged-particles/protocol-subgraph/networks/polygon');
const mumbaiAddresses = require('@charged-particles/protocol-subgraph/networks/mumbai');

const contractAddresses = {
  1: mainnetAddresses,
  42: kovanAddresses,
  137: polygonAddresses,
  80001: mumbaiAddresses,
};

// Charged Particles Contracts
const ChargedParticles = ContractFactory.create({ name: 'ChargedParticles', abi: ChargedParticlesAbi });
const ChargedState = ContractFactory.create({ name: 'ChargedState', abi: ChargedStateAbi });
const Proton = ContractFactory.create({ name: 'Proton', abi: ProtonAbi });
const Lepton = ContractFactory.create({ name: 'Lepton', abi: LeptonAbi });
const Lepton2 = ContractFactory.create({ name: 'Lepton2', abi: Lepton2Abi });
const WBoson = ContractFactory.create({ name: 'WBoson', abi: WBosonAbi });

// Helpers
const _contractMap = {
  ChargedParticles,
  ChargedState,
  Proton,
  Lepton,
  Lepton2,
  WBoson,
};

const _contractAbiMap = {
  ChargedParticles: ChargedParticlesAbi,
  ChargedState: ChargedStateAbi,
  Proton: ProtonAbi,
  Lepton: LeptonAbi,
  Lepton2: Lepton2Abi,
  WBoson: WBosonAbi,
  ERC721: Erc721Abi
};

const getContractByName = (contractName) => {
  return _contractMap[contractName];
};
const getContractAbiByName = (contractName) => {
  return _contractAbiMap[contractName];
};

const getContractAddress = (contractName, connectedNetworkId) => {
  const defaultChainId = parseInt(GLOBALS.DEFAULT_CHAIN_ID, 10);
  const networkAddresses = _.get(contractAddresses, connectedNetworkId, contractAddresses[defaultChainId]);
  return networkAddresses[_.camelCase(contractName)].address;
};

const getContractNetwork = (contractAddress) => {
  const whitelistedAddresses = [];

  // TODO: optimize
  // * try: whitelisted => _.flatten =>  _.find(x, { contract })
  for (let networkObj in GLOBALS.WHITELISTED_CONTRACTS) {
    for (let contract in GLOBALS.WHITELISTED_CONTRACTS[networkObj]) {
      whitelistedAddresses.push({ contract: contract, chainId: networkObj });
    }
  };
  const whitelistedContract = _.find(whitelistedAddresses, { 'contract': contractAddress });

  let network = _.keys(contractAddresses).find(key => {
    return _.keys(contractAddresses[key]).some(subkey => contractAddresses[key][subkey].address?.toLowerCase() == contractAddress.toLowerCase());
  });

  // checks if contractAddress is one of the whitelisted ones
  if (!_.isUndefined(whitelistedContract)) {
    network = whitelistedContract.chainId;
  }

  return network;
};

const isProtonContract = (contractAddress) => {
  return _.keys(contractAddresses)
    .some(key => _.toLower(contractAddresses[key].proton.address) === _.toLower(contractAddress));
};

const isWhitelistedContract = (contractAddress) => {
  return _.keys(GLOBALS.WHITELISTED_CONTRACTS)
    .some(key => _.keys(GLOBALS.WHITELISTED_CONTRACTS[key])
      .includes(contractAddress.toLowerCase()));
};

export {
  getContractByName,
  getContractAbiByName,
  getContractNetwork,
  getContractAddress,
  isProtonContract,
  isWhitelistedContract,
  ChargedParticles,
  ChargedState,
  Proton,
  Lepton,
  Lepton2,
  WBoson,
};
