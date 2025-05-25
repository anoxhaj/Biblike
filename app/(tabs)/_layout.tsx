import { Tabs } from "expo-router";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Feather from "@expo/vector-icons/Feather";

import * as Styles from "../../constants/Styles";
import useColorSchemeDefault from "../../hooks/useColorScheme";

export default function TabLayout() {
  const theme = useColorSchemeDefault();
  return (
    <Tabs
      initialRouteName="bible"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Styles.Colors[theme].secondaryText,
        tabBarStyle: {
          backgroundColor: Styles.Colors[theme].primaryBackground,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerTitle: "",
          title: "DEV_LOG",
          tabBarIcon: ({ color }) => (
            <Feather name="settings" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="bible"
        options={{
          headerTitle: "",
          title: "Bible",
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="bible" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
