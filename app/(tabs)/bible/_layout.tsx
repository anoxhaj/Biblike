import { Stack } from "expo-router";

import useColorSchemeDefault from "../../../hooks/useColorScheme";
import * as Styles from "../../../constants/Styles";

const StackLayout = () => {
  const theme = useColorSchemeDefault();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: Styles.Colors[theme].primaryBackground,
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="references"
        options={{
          headerTitle: "References",
        }}
      />
      <Stack.Screen
        name="crossReferences"
        options={{
          headerTitle: "Cross References",
        }}
      />
      <Stack.Screen
        name="[version]/[chapter]"
        options={{
          headerShown: false,
          animation: "none",
        }}
      />
    </Stack>
  );
};

export default StackLayout;
