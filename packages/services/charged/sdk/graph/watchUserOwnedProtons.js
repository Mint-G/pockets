// Frameworks
import { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import * as _ from 'lodash';

// App Components
import { userOwnedProtonQuery } from '../graph/queries/userOwnedProtonQuery';
import { getNftMetadataBatched } from './getNftMetadataBatched';
import { GLOBALS } from '../../utils/globals';

/*
* Deprecated - not being used anywhere else in project
*/
export const watchUserOwnedProtons = ({
  userAddress,
  fetchPolicy = 'cache-and-network',
  pollInterval = GLOBALS.GRAPH_USER_PROTONS_POLL_INTERVAL,
  dispatch = _.noop,
  connectedNetworkId
}) => {
  let { loading, error: queryError, data: queryData } = useQuery(userOwnedProtonQuery, {
    context: { fromUniverse: true },
    variables: {
      userAddress: _.toLower(userAddress)
    },
    fetchPolicy,
    pollInterval,
  });

  useEffect(() => {
    const nfts = _.get(queryData, 'protonNFTs', []).slice(0);
    getNftMetadataBatched({nfts, skipItem: _hasMetadata, connectedNetworkId})
      .then(({error: fetchError, data: fetchData}) => {
        const error = {queryError, fetchError};
        dispatch({loading, error, data: fetchData});
      });
  }, [userAddress, loading, queryError, queryData]);
};
const _hasMetadata = (nft) => {
  return !_.isEmpty(_.get(nft, 'image', ''));
};
