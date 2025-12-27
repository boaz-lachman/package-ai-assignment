import React, { useEffect, useState } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  interpolate,
  Extrapolation,
  Easing
} from 'react-native-reanimated';
import FloatingButtonMenuOption from './FloatingButtonMenuOption';
import { useSnackbar } from '../contexts/useSnackbarContext';

//for displaying a floating button with multiple options

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export interface FloatingButtonOption {
  title: string;
  onPress: () => void;
  color?: string;
}

interface FloatingButtonMenuProps {
  options: FloatingButtonOption[];
  mainButtonColor?: string;
  mainButtonIcon?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

const FloatingButtonMenu: React.FC<FloatingButtonMenuProps> = ({
  options,
  mainButtonColor = '#007AFF',
  mainButtonIcon = '+',
  position = 'bottom-right',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isVisible } = useSnackbar();
  const menuScale = useSharedValue(0);
  const rotation = useSharedValue(0);
  const buttonLift = useSharedValue(0);
  const optionScales = options.map(() => useSharedValue(0));

  useEffect(() => {
    buttonLift.value = withTiming(isVisible ? -100 : 0, { duration: 200, easing: Easing.linear });
  }, [isVisible])

  const toggleMenu = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);

    if (newIsOpen) {
      rotation.value = withSpring(45, { damping: 15 });

      // Animate each option button with staggered delay
      optionScales.forEach((scale) => {
        scale.value = withTiming(1, {
         duration: 300, easing: Easing.bounce,
        }, () => {
          // Animation complete callback
        });
      });
    } else {
      rotation.value = withSpring(0, { damping: 15 });

      optionScales.forEach((scale) => {
        scale.value = withTiming(0, { duration: 300, easing: Easing.bounce, });
      });
    }
  };

  const handleOptionPress = (option: FloatingButtonOption) => {
    toggleMenu();
    // Small delay to allow close animation to start
    setTimeout(() => {
      option.onPress();
    }, 100);
  };

  const backdropStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: menuScale.value }],
    };
  });

  const mainButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }, { translateY: buttonLift.value }],
    };
  });

  const getOptionStyle = (index: number) => {
    return useAnimatedStyle(() => {
      const scale = optionScales[index].value;
      const translateX = interpolate(
        scale,
        [0, 1],
        [0, -SCREEN_WIDTH / 3],
        Extrapolation.CLAMP
      );
      const translateY = interpolate(
        scale,
        [0, 1],
        [0, -(60 + index * 70)],
        Extrapolation.CLAMP
      );
      const opacity = interpolate(
        scale,
        [0, 1],
        [0, 1],
        Extrapolation.CLAMP
      );

      return {
        transform: [{ translateX }, { translateY }, { scale }],
        opacity,
      };
    });
  };

  const getContainerStyle = () => {
    const baseStyle = styles.container;
    switch (position) {
      case 'bottom-right':
        return [baseStyle, styles.bottomRight];
      case 'bottom-left':
        return [baseStyle, styles.bottomLeft];
      case 'top-right':
        return [baseStyle, styles.topRight];
      case 'top-left':
        return [baseStyle, styles.topLeft];
      default:
        return [baseStyle, styles.bottomRight];
    }
  };

  return (
    <View style={getContainerStyle()}>
      {/* Backdrop */}
      {isOpen && (
        <Animated.View
          style={[styles.backdrop, backdropStyle]}
          pointerEvents={isOpen ? 'auto' : 'none'}
        >
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={toggleMenu}
          />
        </Animated.View>
      )}

      {/* Option buttons */}
      {options.map((option, index) => {
        const optionStyle = getOptionStyle(index);
        return (
          <FloatingButtonMenuOption
            key={index}
            option={option}
            animatedStyle={optionStyle}
            isOpen={isOpen}
            onPress={handleOptionPress}
          />
        );
      })}

      {/* Main floating button */}
      <Animated.View style={mainButtonStyle}>
        <TouchableOpacity
          style={[styles.mainButton, { backgroundColor: mainButtonColor }]}
          onPress={toggleMenu}
          activeOpacity={0.8}
        >
          <Text style={styles.mainButtonIcon}>{mainButtonIcon}</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 1000,
  },
  bottomRight: {
    bottom: 50,
    right: 30,
  },
  bottomLeft: {
    bottom: 50,
    left: 30,
  },
  topRight: {
    top: 30,
    right: 30,
  },
  topLeft: {
    top: 30,
    left: 30,
  },
  backdrop: {
    position: 'absolute',
    width: SCREEN_WIDTH * 2,
    height: SCREEN_HEIGHT * 2,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: SCREEN_WIDTH,
    left: -SCREEN_WIDTH / 2,
    top: -SCREEN_HEIGHT / 2,
  },
  mainButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  mainButtonIcon: {
    fontSize: 30,
    color: '#fff',
    fontWeight: '300',
  },
});

export default FloatingButtonMenu;
