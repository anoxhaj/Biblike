import { View, StyleSheet, ActivityIndicator } from "react-native";

import { STYLES } from "@/constants";
import { useColorSchemeDefault } from "@/hooks";

export default function Loader() {
  const theme = useColorSchemeDefault();
  const styles = BuildStyleSheet(theme);

  return (
    <View style={styles.loaderView}>
      <ActivityIndicator
        size="large"
        color={STYLES.COLORS[theme].TEXT.PRIMARY}
        style={styles.loader}
      />
    </View>
  );
}

function BuildStyleSheet(theme: "dark" | "light") {
  return StyleSheet.create({
    loaderView: {
      backgroundColor: STYLES.COLORS[theme].BACKGROUND.PRIMARY,
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      height: "100%",
      width: "100%",
    },
    loader: {
      backgroundColor: STYLES.COLORS[theme].BACKGROUND.PRIMARY,
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      height: "100%",
      width: "100%",
    },
  });
}
