import React, { useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { useDispatch, useSelector } from 'react-redux';
import { NetworkRequest } from '../models/networkRequest';
import {SafeAreaView} from 'react-native-safe-area-context';
import NetworkRequestItem from '../components/NetworkRequestItem';
import { addNetworkRequest, networkRequestsState, removeAllNetworkRequests, removeNetworkRequest, setSendingStatus } from '../reducers/networkRequestsReducer';
import FloatingButtonMenu, { FloatingButtonOption } from '../components/FloatingButtonMenu';
import { createBigNetworkRequest, createSmallNetworkRequest } from '../utils/createNetworkRequests';
import uuid from 'react-native-uuid';
import LoadingSpinner from '../components/LoadingSpinner';
import { sendingStatus } from '../constants/sendingStatus';
import { postAllRequests, postRequest } from '../api/api';
import { useSnackbar } from '../contexts/useSnackbarContext';
import ConnectivityInfoBanner from '../components/ConnectivityInfoBanner';
import { useNetInfoInstance } from '@react-native-community/netinfo';
import useAppIsInForeground from '../hooks/useAppIsInForeground';




const NetworkRequestsScreen: React.FC = () => {
  const networkRequests = useSelector((state: networkRequestsState) => state.networkRequests || {small:[], large: []});
  const isSending = useSelector((state: networkRequestsState) => state.sendingStatus === sendingStatus.INPROGRESS);
  const dispatch = useDispatch();
  const { showSuccess, showError } = useSnackbar();
  const renderItem = ({ item }: { item: NetworkRequest }) => {
    return <NetworkRequestItem handleRemoveExt={() => {
        dispatch(removeNetworkRequest(item.id))
    }}
    handleRefreshExt={() => {
        postRequest(item,  (networkRequest: NetworkRequest) => {
           showSuccess(`${networkRequest.size} request sent successfully at ${new Date().toLocaleTimeString()}`);
        dispatch(removeNetworkRequest(networkRequest.id));
    }, (networkRequest: NetworkRequest) => {
      showError(`Failed to send request`);
    }, 
    () =>{
       
    })
    }}
     item={item} />;
  };


  // function for sending all the network requests in the queue
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
  const { netInfo: { type, isConnected }, refresh } = useNetInfoInstance();

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


  //options and actions for the floating button
  const options: FloatingButtonOption[] = [
    {
      title: 'Add Small Request',
      onPress: () => {
        const newSmallRequest = createSmallNetworkRequest(uuid.v4(), 'https://httpbin.org/post' );
        dispatch(addNetworkRequest(newSmallRequest));
        dispatch(setSendingStatus(sendingStatus.INPROGRESS));
       
    },
      color: '#FF6B6B',
    },
    {
      title: 'Add Large Request',
      onPress: async () => {
        const newLargeRequest = await createBigNetworkRequest(uuid.v4(), 'https://httpbin.org/post' );
        dispatch(addNetworkRequest(newLargeRequest));
        dispatch(setSendingStatus(sendingStatus.INPROGRESS));
      },
      color: '#4ECDC4',
    },
  ];

  const keyExtractor = (item: NetworkRequest) => item.id;
  const combined = [...networkRequests.small, ...networkRequests.large];
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleBar}>
        <Text style={styles.title}>Network Requests</Text>
        {combined.length > 0 && (
          <TouchableOpacity onPress={handleClearAll}>
            <Text style={styles.clearAllButton}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>
      <ConnectivityInfoBanner/>
      <Animated.FlatList
        data={combined}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListEmptyComponent={<View style={styles.emptyDataContainer}>
          <Text style={styles.emptyDataStyle}>No Requests Are Pending at the Moment</Text>
        </View>}
        contentContainerStyle={styles.listContent}
      />
       <FloatingButtonMenu
        options={options}
        mainButtonColor="#007AFF"
        mainButtonIcon="+"
        position="bottom-right"
      /> 
      {isSending && <LoadingSpinner />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    position: 'relative',
  },
  emptyDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center', 
    paddingHorizontal: 30
  },

  emptyDataStyle: {
    color: 'black',
    fontSize: 24
  },

  titleBar: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#f5f5f5',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  clearAllButton: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  listContent: {
    flexGrow: 1,
    padding: 16,
  },
});

export default NetworkRequestsScreen;

