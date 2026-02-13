import React from 'react';
import { View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Screen({
  children,
  style,
  removeTopEdge,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
  removeTopEdge?: boolean;
}) {
  return (
    <SafeAreaView
      style={{ flex: 1 }}
      edges={removeTopEdge ? ['left', 'right', 'bottom'] : undefined}
    >
      <View style={[{ flex: 1 }, style]}>{children}</View>
    </SafeAreaView>
  );
}
