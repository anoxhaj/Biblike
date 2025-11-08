import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Pressable,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";

import {
  useUpdateConfig,
  useCurrentVersion,
  useAppVersions,
} from "@/constants/store";
import * as Helper from "@/helpers/Helper";
import * as Styles from "@/constants/Styles";
import useColorScheme from "@/hooks/useColorScheme";

export default function VersionsPicker({ chapterId }: { chapterId: number }) {
  const router = useRouter();
  const db = useSQLiteContext();
  const theme = useColorScheme();
  const styles = BuildStyleSheet(theme);
  const currentVersion = useCurrentVersion();
  const versions = useAppVersions();
  const updateConfig = useUpdateConfig();

  const [modalVisible, setModalVisible] = useState(false);

  const handleVersionChange = async (value: number) => {
    if (value === currentVersion) {
      setModalVisible(false);
      return;
    }

    await updateConfig("VERSION", Number(value), db);
    setModalVisible(false);
    router.replace(Helper.buildChapterUrl(value, chapterId));
  };

  const getAbbreviation = (id: number | null) => {
    const found = versions.find((v) => v.id === id);
    return found?.abbreviation || "Select Version";
  };

  return (
    <>
      <TouchableOpacity
        style={styles.circleWrapper}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.circleText}>{getAbbreviation(currentVersion)}</Text>
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Version</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollView}>
              {versions.map((version) => (
                <TouchableOpacity
                  key={version.id}
                  style={[
                    styles.versionItem,
                    version.id === currentVersion && styles.versionItemSelected,
                  ]}
                  onPress={() => handleVersionChange(version.id)}
                >
                  <Text
                    style={[
                      styles.versionText,
                      version.id === currentVersion &&
                        styles.versionTextSelected,
                    ]}
                  >
                    {version.name}
                  </Text>
                  <Text
                    style={[
                      styles.versionSubtext,
                      version.id === currentVersion &&
                        styles.versionSubtextSelected,
                    ]}
                  >
                    {version.abbreviation} • {version.year}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const WIDTH = 66;
const HEIGHT = 50;

function BuildStyleSheet(theme: "dark" | "light") {
  const colors = Styles.Colors[theme];

  return StyleSheet.create({
    circleWrapper: {
      position: "relative",
      width: WIDTH,
      height: HEIGHT,
      borderRadius: 21,
      backgroundColor: colors.secondaryBackground,
      justifyContent: "center",
      alignItems: "center",
    },
    circleText: {
      fontSize: 16,
      color: colors.primaryText,
      fontFamily: Styles.Font.bold,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    modalContent: {
      backgroundColor: colors.primaryBackground,
      borderRadius: 16,
      width: "85%",
      maxHeight: "70%",
      overflow: "hidden",
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.secondaryBackground,
    },
    modalTitle: {
      fontSize: 20,
      color: colors.primaryText,
      fontFamily: Styles.Font.bold,
    },
    closeButton: {
      fontSize: 24,
      color: colors.secondaryText,
    },
    scrollView: {
      maxHeight: "100%",
    },
    versionItem: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.secondaryBackground,
    },
    versionItemSelected: {
      backgroundColor: colors.secondaryBackground,
    },
    versionText: {
      fontSize: 16,
      color: colors.primaryText,
      fontFamily: Styles.Font.bold,
      marginBottom: 4,
    },
    versionTextSelected: {
      color: colors.primaryText,
    },
    versionSubtext: {
      fontSize: 14,
      color: colors.secondaryText,
      fontFamily: Styles.Font.regular,
    },
    versionSubtextSelected: {
      color: colors.secondaryText,
    },
  });
}
