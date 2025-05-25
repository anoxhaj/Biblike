import { View, StyleSheet, Pressable, Text } from "react-native";

import * as Styles from "../../constants/Styles";
import useColorScheme from "../../hooks/useColorScheme";

export default function Verse({
  id,
  number,
  text,
  onPress,
  selected = false,
}: {
  id: number;
  number: number;
  text: string;
  onPress: any;
  selected: boolean;
}) {
  const theme = useColorScheme();
  const styles = BuildStyleSheet(theme);

  return (
    <>
      <View style={styles.itemContainer} key={id}>
        <Text>
          <View>
            <Text style={styles.superscript}>{number} &nbsp;&nbsp;&nbsp;</Text>
          </View>
          <Text
            onPress={() => onPress(id)}
            style={StyleSheet.flatten([
              styles.itemText,
              {
                textDecorationLine: selected ? "underline" : undefined,
              },
            ])}
          >
            {text}
          </Text>
        </Text>
      </View>
    </>
  );
}

function BuildStyleSheet(theme: "dark" | "light") {
  return StyleSheet.create({
    itemContainer: {
      marginHorizontal: 30,
      marginVertical: 12,
    },
    itemText: {
      fontFamily: Styles.Font.regular,
      fontSize: Styles.Font.size,
      lineHeight: 33,
      color: Styles.Colors[theme].primaryText,
    },
    superscript: {
      fontFamily: Styles.Font.regular,
      fontSize: 13,
      color: Styles.Colors[theme].secondaryText,
    },
  });
}
