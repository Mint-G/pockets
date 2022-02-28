
const token = ({ tokenId, contractAddress, chainId }) => (
  {
    tokenId: Number(tokenId),
    contractAddress: String(contractAddress),
    chainId: Number(chainId)
  }
);

export { token };
