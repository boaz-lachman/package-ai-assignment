import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface FloatingActionButtonsProps {
  onStatusPress: () => void;
  onImagePress: () => void;
}

const FloatingActionButtons: React.FC<FloatingActionButtonsProps> = ({
  onStatusPress,
  onImagePress,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <>
      {/* Bottom Right Floating Button - Send Status Update */}
      <TouchableOpacity
        style={[styles.floatingButtonRight, { bottom: 70 + insets.bottom }]}
        onPress={onStatusPress}
        activeOpacity={0.8}
      >
        <Text style={styles.floatingButtonText}>Add Status</Text>
      </TouchableOpacity>
      {/* Bottom Left Floating Button - Send Image */}
      <TouchableOpacity
        style={[styles.floatingButtonLeft, { bottom: 70 + insets.bottom }]}
        onPress={onImagePress}
        activeOpacity={0.8}
      >
        <Text style={styles.floatingButtonText}>Add Image Verification</Text>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  floatingButtonRight: {
    position: 'absolute',
    right: 20,
    width: 100,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 2000,
  },
  floatingButtonLeft: {
    position: 'absolute',
    left: 20,
    width: 100,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#4ECDC4',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 2000,
  },
  floatingButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default FloatingActionButtons;

