import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { FloatingButtonOption } from './FloatingButtonMenu';

interface FloatingButtonMenuOptionProps {
  option: FloatingButtonOption;
  animatedStyle: any;
  isOpen: boolean;
  onPress: (option: FloatingButtonOption) => void;
}

const FloatingButtonMenuOption: React.FC<FloatingButtonMenuOptionProps> = ({
  option,
  animatedStyle,
  isOpen,
  onPress,
}) => {
  return (
    <Animated.View
      style={[styles.optionButton, animatedStyle]}
      pointerEvents={isOpen ? 'auto' : 'none'}
    >
      <TouchableOpacity
        style={[
          styles.optionButtonContent,
          { backgroundColor: option.color || '#fff' },
        ]}
        onPress={() => onPress(option)}
        activeOpacity={0.8}
      >
        <Text style={styles.optionTitle}>{option.title}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  optionButton: {
    position: 'absolute',
    width: 200,
    alignItems: 'flex-end',
  },
  optionButtonContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    backgroundColor: '#fff',
    minWidth: 120,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  optionTitle: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
});

export default FloatingButtonMenuOption;

