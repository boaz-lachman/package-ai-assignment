import { useEffect, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { sendingStatus } from '../constants/sendingStatus';
import { useSnackbar } from '../contexts/useSnackbarContext';
import { addNetworkRequest, networkRequestsState, removeAllNetworkRequests, removeNetworkRequest, setNetworkRequestAsSent, setSendingStatus } from '../store/networkRequestsReducer';
import { postAllRequests, postRequest } from '../api/api';
import { NetworkRequest, RequestSize } from '../models/networkRequest';
import { useNetInfoInstance } from '@react-native-community/netinfo';
import { Alert } from 'react-native';
import useAppIsInForeground from './useAppIsInForeground';
import { format } from "date-fns";
import { debounce } from 'lodash';

const useNetworkRequestsScreen = () => {
    // All hooks must be called at the top level in the same order every render
    const networkRequests = useSelector((state: networkRequestsState) => state.networkRequests || { small: [], large: [] });
    const isSending = useSelector((state: networkRequestsState) => state.sendingStatus === sendingStatus.INPROGRESS);
    const dispatch = useDispatch();
    const { showSuccess } = useSnackbar();
    const { netInfo: { isConnected } } = useNetInfoInstance();
    const isAppInForeground = useAppIsInForeground();

    const sendingAllRequests = useCallback(() => {
        let successCount = 0;
            const failureCount = 0;
            const totalRequests = networkRequests.small.filter(req => !req.isSent).length + networkRequests.large.filter(req => !req.isSent).length;

            postAllRequests(networkRequests,
                (networkRequest: NetworkRequest) => {
                  successCount++;
                  showSuccess(`${networkRequest.size === RequestSize.Small ? 'Status Update' : 'Image Verification'} request sent successfully at ${format(new Date(), 'dd/MM/yyyy HH:mm')}`);
                dispatch(setNetworkRequestAsSent(networkRequest.id));
            }, () => {
              //maybe to be added later
            }, () =>{
                dispatch(setSendingStatus(sendingStatus.IDLE));

                // Show summary message if multiple requests
                if (totalRequests > 1) {
                  if (successCount !== 0) {
                    showSuccess(`${successCount} updates sent successfully at ${format(new Date(), 'dd/MM/yyyy HH:mm')} `);
                  } else {}
                }
            });
        }, [networkRequests, showSuccess, dispatch]);

     /*when to initiate sending all requests with debounce using lodash */
  const debouncedSendingAllRequests = useMemo(
    () => debounce(sendingAllRequests, 500),
    [sendingAllRequests]
  );

  useEffect(() => {
    if (isSending) {
      debouncedSendingAllRequests();
    } else {
      // Cancel pending debounced calls when isSending becomes false
      debouncedSendingAllRequests.cancel();
    }

    // Cleanup function to cancel pending debounced calls on unmount
    return () => {
      debouncedSendingAllRequests.cancel();
    };
  }, [isSending, debouncedSendingAllRequests]);

  /*listening to both network changes and background foreground changes */
  useEffect(() => {
    if (isConnected) {
      dispatch(setSendingStatus(sendingStatus.INPROGRESS));
    }
  }, [isConnected, dispatch])

  useEffect(() => {
    if (isAppInForeground) {
      dispatch(setSendingStatus(sendingStatus.INPROGRESS));
    }
  }, [isAppInForeground, dispatch])

  const handleClearAll = () => {
    Alert.alert(
      'Clear All',
      'Are you sure you want to remove all updates?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            dispatch(removeAllNetworkRequests());
          },
        },
      ]
    );
  };

  const removeNetworkRequestExt = (networkRequest: NetworkRequest) => {
    dispatch(removeNetworkRequest(networkRequest.id));
  }

  const refreshSendingNetworkRequest = (networkRequest: NetworkRequest) => {
    postRequest(networkRequest, (request: NetworkRequest) => {
        showSuccess(`${request.size} request sent successfully at ${format(new Date(), 'dd/MM/yyyy HH:mm')}`);
     dispatch(setNetworkRequestAsSent(request.id));
  }, () => {
    //maybe to be added later
  },
  () => {

  });
  };

  const addNetworkRequestToQueue = (networkRequest: NetworkRequest) => {
    dispatch(addNetworkRequest(networkRequest));
    dispatch(setSendingStatus(sendingStatus.INPROGRESS));
  }

  return { handleClearAll, sendingAllRequests, networkRequests, isSending,
    refreshSendingNetworkRequest, removeNetworkRequestExt, addNetworkRequestToQueue };
}

export default useNetworkRequestsScreen;
