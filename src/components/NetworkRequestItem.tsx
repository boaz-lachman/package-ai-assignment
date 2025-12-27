import React, { useRef } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import Animated, {
  useAnimatedStyle,
  interpolate,
  SharedValue,
  Extrapolation,
} from 'react-native-reanimated';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { NetworkRequest, RequestSize } from '../models/networkRequest';
import { format } from "date-fns";

interface NetworkRequestItemProps {
    handleRefreshExt: Function,
    handleRemoveExt: Function,
  item: NetworkRequest;
}

const ACTION_WIDTH = 100;


const NetworkRequestItem: React.FC<NetworkRequestItemProps> = ({ item, handleRemoveExt, handleRefreshExt }) => {
  const swipeableRef = useRef<React.ComponentRef<typeof Swipeable>>(null);

  const handleRefresh = () => {
    handleRefreshExt();
    swipeableRef.current?.close();
  };

  const handleDelete = () => {
    handleRemoveExt();
    swipeableRef.current?.close();
  };

  const renderLeftActions = (
    progress: SharedValue<number>,
    dragX: SharedValue<number>
  ) => {
    const scale = useAnimatedStyle(() => {
      const scaleValue = interpolate(
        dragX.value,
        [0, ACTION_WIDTH],
        [0, 1],
        Extrapolation.CLAMP
      );
      return {
        transform: [{ scale: scaleValue }],
      };
    });

    return (
      <Animated.View style={[styles.leftAction, scale]}>
        <Text style={styles.actionIcon}>🗑️</Text>
      </Animated.View>
    );
  };

  const renderRightActions = (
    progress: SharedValue<number>,
    dragX: SharedValue<number>
  ) => {
    const scale = useAnimatedStyle(() => {
      const scaleValue = interpolate(
        dragX.value,
        [0, -ACTION_WIDTH],
        [0, 1],
        Extrapolation.CLAMP
      );
      return {
        transform: [{ scale: scaleValue }],
      };
    });

    return (
      <Animated.View style={[styles.rightAction, scale]}>
        <Text style={styles.actionIcon}>🔄</Text>
      </Animated.View>
    );
  };

  return (
    <Swipeable
      ref={swipeableRef}
      renderLeftActions={renderLeftActions}
      renderRightActions={renderRightActions}
      onSwipeableOpen={(direction) => {
        if (direction === 'left') {
          handleRefresh();
        } else if (direction === 'right') {
          handleDelete();
        }
      }}
      overshootRight={false}
      overshootLeft={false}
    >
      <Animated.View style={styles.container}>
        {item.size === RequestSize.Large && (
          <Image source={{uri:item.data.uri}} style={styles.image} resizeMode="cover" />
        )}
        {item.size === RequestSize.Small && (
          <Text style={styles.title}>{`request for ${item.data.driver}`}</Text>
        )}
        <Text style={styles.size}>Size: {item.size}</Text>
        <Text style={styles.date}>
          { format(item.createdAt, 'dd/MM/yyyy HH:mm')}
        </Text>
      </Animated.View>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  leftAction: {
    flex: 1,
    backgroundColor: '#ff4444',
    justifyContent: 'center',
    alignItems: 'flex-start',
    borderRadius: 8,
    paddingLeft: 30,
    marginBottom: 12,
    width: ACTION_WIDTH,
  },
  rightAction: {
    flex: 1,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 30,
    borderRadius: 8,
    marginBottom: 12,
    width: ACTION_WIDTH,
  },
  actionIcon: {
    fontSize: 24,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  size: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
});

export default NetworkRequestItem;

