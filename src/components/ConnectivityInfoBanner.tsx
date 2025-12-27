import React, { useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';
import { useNetInfoInstance } from "@react-native-community/netinfo";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

const ConnectivityInfoBanner: React.FC = () => {
  const { netInfo: { isConnected } } = useNetInfoInstance();

  // Animated value for banner position
  const translateY = useSharedValue(-20);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (!isConnected) {
      // Slide in and fade in
      translateY.value = withTiming(0,
        { duration: 300 }
      );
      opacity.value = withTiming(1, { duration: 300 });
    } else {
      // Slide out and fade out
      translateY.value = withTiming(-20, { duration: 300 });
      opacity.value = withTiming(0, { duration: 300 });
    }
  }, [isConnected]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.bannerStyle, animatedStyle]}>
      <Text style={styles.bannerText}>
        There is no internet connectivity at the moment
      </Text>
    </Animated.View>
  );
};

export default ConnectivityInfoBanner;

const styles = StyleSheet.create({
  bannerStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 20,
    backgroundColor: 'black',
  },
  bannerText: {
    color: 'white',
    fontSize: 12,
  },
});
