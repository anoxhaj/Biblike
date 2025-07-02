import { View, StyleSheet, ActivityIndicator } from "react-native";

import * as Styles from "../../constants/Styles";
import useColorScheme from "../../hooks/useColorScheme";

export default function Loader() {
  const theme = useColorScheme();
  const styles = BuildStyleSheet(theme);

  return (
    <View style={styles.loaderView}>
      <ActivityIndicator
        size="large"
        color={Styles.Colors[theme].primaryText}
        style={styles.loader}
      />
    </View>
  );
}

function BuildStyleSheet(theme: "dark" | "light") {
  return StyleSheet.create({
    loaderView: {
      backgroundColor: Styles.Colors[theme].primaryBackground,
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      height: "100%",
      width: "100%",
    },
    loader: {
      backgroundColor: Styles.Colors[theme].primaryBackground,
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      height: "100%",
      width: "100%",
    },
  });
}
