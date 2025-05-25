import { useColorScheme } from "react-native";

export default function useColorSchemeDefault(): "dark" | "light" {
  const theme = useColorScheme() == "dark" ? "dark" : "light";
  return theme;
}
