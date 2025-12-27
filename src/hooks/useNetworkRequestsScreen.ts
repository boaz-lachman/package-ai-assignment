import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { sendingStatus } from '../constants/sendingStatus';
import { useSnackbar } from '../contexts/useSnackbarContext';
import { addNetworkRequest, networkRequestsState, removeAllNetworkRequests, removeNetworkRequest, setSendingStatus } from '../store/networkRequestsReducer';
import { postAllRequests, postRequest } from '../api/api';
import { NetworkRequest } from '../models/networkRequest';
import { useNetInfoInstance } from '@react-native-community/netinfo';
import { Alert } from 'react-native';
import useAppIsInForeground from './useAppIsInForeground';



const useNetworkRequestsScreen = () => {
    const networkRequests = useSelector((state: networkRequestsState) => state.networkRequests || {small:[], large: []});
    const isSending = useSelector((state: networkRequestsState) => state.sendingStatus === sendingStatus.INPROGRESS);
    const dispatch = useDispatch();
    const { showSuccess, showError } = useSnackbar();

    const sendingAllRequests = () => {
        let successCount = 0;
            let failureCount = 0;
            const totalRequests = networkRequests.small.length + networkRequests.large.length;
    
            postAllRequests(networkRequests, 
                (networkRequest: NetworkRequest) => {
                  successCount++;
                  showSuccess(`${networkRequest.size} request sent successfully at ${new Date().toLocaleTimeString()}`);
                dispatch(removeNetworkRequest(networkRequest.id));
            }, (networkRequest: NetworkRequest) => {
                failureCount++;
                if(totalRequests === 1) {
                showError(`Failed to send request`);
                }
            }, () =>{
                dispatch(setSendingStatus(sendingStatus.IDLE));
                
                // Show summary message if multiple requests
                if (totalRequests > 1) {
                  if (failureCount === 0) {
                    showSuccess(`All ${successCount} requests sent successfully at ${new Date().toLocaleTimeString()} `);
                  } else if (successCount === 0) {
                    showError(`Failed to send ${failureCount} requests`);
                  } else {
                    showError(`${successCount} succeeded, ${failureCount} failed`);
                  }
                }
            });
        }

     /*when to initiate sending all requests */ 
  useEffect(() => {
    if(isSending) {
      sendingAllRequests();
    }
  }, [isSending]);


  /*listening to both network changes and background foreground changes */ 
  const { netInfo: {  isConnected } } = useNetInfoInstance();

  useEffect(() => {
    if(isConnected) {
      dispatch(setSendingStatus(sendingStatus.INPROGRESS));
    }
  },[isConnected] )

  const isAppInForeground = useAppIsInForeground();

  useEffect(() => {
    if(isAppInForeground) {
      dispatch(setSendingStatus(sendingStatus.INPROGRESS));
    }
  }, [isAppInForeground])



  const handleClearAll = () => {
    Alert.alert(
      'Clear All',
      'Are you sure you want to remove all unsent requests?',
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
    postRequest(networkRequest,  (networkRequest: NetworkRequest) => {
        showSuccess(`${networkRequest.size} request sent successfully at ${new Date().toLocaleTimeString()}`);
     dispatch(removeNetworkRequest(networkRequest.id));
  }, (networkRequest: NetworkRequest) => {
    showError(`Failed to send request`);
  }, 
  () =>{
     
  })}


  const addNetworkRequestToQueue = (networkRequest: NetworkRequest) => {
    dispatch(addNetworkRequest(networkRequest));
    dispatch(setSendingStatus(sendingStatus.INPROGRESS));
  }

  return {handleClearAll, sendingAllRequests, networkRequests, isSending,  
    refreshSendingNetworkRequest, removeNetworkRequestExt, addNetworkRequestToQueue};
    
}

export default useNetworkRequestsScreen;