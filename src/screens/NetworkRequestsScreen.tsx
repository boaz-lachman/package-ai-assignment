import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { NetworkRequest } from '../models/networkRequest';
import {SafeAreaView} from 'react-native-safe-area-context';
import NetworkRequestItem from '../components/NetworkRequestItem';

import FloatingButtonMenu, { FloatingButtonOption } from '../components/FloatingButtonMenu';
import { createBigNetworkRequest, createSmallNetworkRequest } from '../utils/createNetworkRequests';
import uuid from 'react-native-uuid';
import LoadingSpinner from '../components/LoadingSpinner';
import ConnectivityInfoBanner from '../components/ConnectivityInfoBanner';
import useNetworkRequestsScreen from '../hooks/useNetworkRequestsScreen';


const {handleClearAll, networkRequests, isSending,  
  refreshSendingNetworkRequest, removeNetworkRequestExt, addNetworkRequestToQueue} = useNetworkRequestsScreen();

const NetworkRequestsScreen: React.FC = () => {
  const renderItem = ({ item }: { item: NetworkRequest }) => {
    return (
      <NetworkRequestItem
        handleRemoveExt={() => removeNetworkRequestExt(item)}
        handleRefreshExt={() => refreshSendingNetworkRequest(item)}
        item={item}
      />
    );
  };


  //options and actions for the floating button
  const options: FloatingButtonOption[] = [
    {
      title: 'Add Small Request',
      onPress: () => {
        const newSmallRequest = createSmallNetworkRequest(uuid.v4(), 'https://httpbin.org/post' );
        addNetworkRequestToQueue(newSmallRequest);
    },
      color: '#FF6B6B',
    },
    {
      title: 'Add Large Request',
      onPress: async () => {
        const newLargeRequest = await createBigNetworkRequest(uuid.v4(), 'https://httpbin.org/post' );
        addNetworkRequestToQueue(newLargeRequest);
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

