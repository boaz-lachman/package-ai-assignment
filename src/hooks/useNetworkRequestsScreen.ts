import { useEffect, useRef } from 'react';
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

const useNetworkRequestsScreen = () => {
    const networkRequests = useSelector((state: networkRequestsState) => state.networkRequests || { small: [], large: [] });
    const isSending = useSelector((state: networkRequestsState) => state.sendingStatus === sendingStatus.INPROGRESS);
    const dispatch = useDispatch();
    const { showSuccess } = useSnackbar();

    const sendingAllRequests = () => {
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
        }

     /*when to initiate sending all requests with debounce */
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevIsSendingRef = useRef<boolean>(false);

  useEffect(() => {
    // Only reset timer when transitioning from false to true
    // This ensures the timer isn't cleared if isSending is still true
    if (isSending && !prevIsSendingRef.current) {
      // Clear any existing timer before setting a new one
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      
      // Set a new timer to debounce the request sending by 500ms
      debounceTimerRef.current = setTimeout(() => {
        sendingAllRequests();
        debounceTimerRef.current = null;
      }, 500);
    } else if (!isSending && prevIsSendingRef.current) {
      // Clear timer if sending status changes to false
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
    }

    // Update previous value
    prevIsSendingRef.current = isSending;

    // Cleanup function to clear timer on unmount
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [isSending]);

  /*listening to both network changes and background foreground changes */
  const { netInfo: { isConnected } } = useNetInfoInstance();

  useEffect(() => {
    if (isConnected) {
      dispatch(setSendingStatus(sendingStatus.INPROGRESS));
    }
  }, [isConnected])

  const isAppInForeground = useAppIsInForeground();

  useEffect(() => {
    if (isAppInForeground) {
      dispatch(setSendingStatus(sendingStatus.INPROGRESS));
    }
  }, [isAppInForeground])

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
