import React from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';

interface TitleSpinnerProps {
  isVisible: boolean;
  size?: 'small' | 'large';
  color?: string;
}

const TitleSpinner: React.FC<TitleSpinnerProps> = ({
  isVisible,
  size = 'small',
  color = '#007AFF'
}) => {
  if (!isVisible) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginRight: 8,
  },
});

export default TitleSpinner;
