import React, { useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  StatusBar,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { NetworkRequest } from '../models/networkRequest';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import NetworkRequestItem from '../components/NetworkRequestItem';

import FloatingButtonMenu, { FloatingButtonOption } from '../components/FloatingButtonMenu';
import { createBigNetworkRequest, createSmallNetworkRequest } from '../utils/createNetworkRequests';
import uuid from 'react-native-uuid';
import ConnectivityInfoBanner from '../components/ConnectivityInfoBanner';
import TitleSpinner from '../components/TitleSpinner';
import useNetworkRequestsScreen from '../hooks/useNetworkRequestsScreen';
import { NETWORK_ADDRESS } from '../constants/networkAddress';

const NetworkRequestsScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { handleClearAll, networkRequests, isSending,
    refreshSendingNetworkRequest, removeNetworkRequestExt, addNetworkRequestToQueue } = useNetworkRequestsScreen();
  const renderItem = ({ item }: { item: NetworkRequest }) => {
    return (
      <NetworkRequestItem
        handleRemoveExt={() => removeNetworkRequestExt(item)}
        handleRefreshExt={() => refreshSendingNetworkRequest(item)}
        item={item}
        isSending={isSending}
      />
    );
  };

  //options and actions for the floating button
  const options: FloatingButtonOption[] = [
    {
      title: 'Add Status Update',
      onPress: () => {
        const newSmallRequest = createSmallNetworkRequest(uuid.v4(), NETWORK_ADDRESS);
        addNetworkRequestToQueue(newSmallRequest);
    },
      color: '#FF6B6B',
    },
    {
      title: 'Add Image Verification',
      onPress: async () => {
        const newLargeRequest = await createBigNetworkRequest(uuid.v4(), NETWORK_ADDRESS);
        addNetworkRequestToQueue(newLargeRequest);
      },
      color: '#4ECDC4',
    },
  ];

  const keyExtractor = (item: NetworkRequest) => item.id;
  const combined = useMemo(() => {
    const allRequests = [...networkRequests.small, ...networkRequests.large];
    return allRequests.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [networkRequests]);
  return (
    <View style={styles.wrapper}>
      <View style={[styles.statusBarBackground, { height: insets.top }]} />
      <LinearGradient
        colors={['#20B2AA', '#FFFFFF']}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
        <View style={styles.titleBar}>
          <View style={styles.titleContainer}>
            <TitleSpinner isVisible={isSending} />
            <Text style={styles.title}>Package Updates</Text>
          </View>
          {combined.length > 0 && (
            <TouchableOpacity
              onPress={handleClearAll}
              disabled={isSending}
              activeOpacity={isSending ? 1 : 0.7}
            >
              <Text style={[styles.clearAllButton, isSending && styles.clearAllButtonDisabled]}>
                Clear All
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <ConnectivityInfoBanner/>
        <Animated.FlatList
          data={combined}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          ListEmptyComponent={
            <View style={styles.emptyDataContainer}>
              <Text style={styles.emptyDataStyle}>No Updates</Text>
            </View>
          }
          contentContainerStyle={styles.listContent}
          style={styles.list}
        />
         <FloatingButtonMenu
          options={options}
          mainButtonColor="#007AFF"
          mainButtonIcon="+"
          position="bottom-right"
        />
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  statusBarBackground: {
    backgroundColor: '#FFFFFF',
    width: '100%',
  },
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    position: 'relative',
  },
  list: {
    backgroundColor: 'transparent',
  },
  emptyDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    backgroundColor: 'transparent',
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
  titleContainer: {
    flexDirection: 'row',
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
  clearAllButtonDisabled: {
    color: '#999',
  },
  listContent: {
    flexGrow: 1,
    padding: 16,
  },
});

export default NetworkRequestsScreen;
