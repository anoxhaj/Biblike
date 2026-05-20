import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Pressable,
} from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';

import { useUpdateConfig, useCurrentVersion, useVersions } from '@/core/stores/configs';
import { urlBuilder } from '@/core/utils';
import { STYLES } from '@/core/constants';
import { useColorSchemeDefault } from '@/core/hooks';

export default function VersionsPicker({ chapterId }: { chapterId: number }) {
  const router = useRouter();
  const db = useSQLiteContext();
  const theme = useColorSchemeDefault();
  const styles = BuildStyleSheet(theme);
  const currentVersion = useCurrentVersion();
  const versions = useVersions();
  const updateConfig = useUpdateConfig();

  const [modalVisible, setModalVisible] = useState(false);

  const handleVersionChange = async (value: number) => {
    if (value === currentVersion) {
      setModalVisible(false);
      return;
    }

    await updateConfig('VERSION', Number(value), db);
    setModalVisible(false);
    router.replace(urlBuilder.chapter(value, chapterId));
  };

  const getAbbreviation = (id: number | null) => {
    const found = versions.find((v) => v.id === id);
    return found?.abbreviation || 'Select Version';
  };

  return (
    <>
      <TouchableOpacity style={styles.circleWrapper} onPress={() => setModalVisible(true)}>
        <Text style={styles.circleText}>{getAbbreviation(currentVersion)}</Text>
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
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
                      version.id === currentVersion && styles.versionTextSelected,
                    ]}
                  >
                    {version.name}
                  </Text>
                  <Text
                    style={[
                      styles.versionSubtext,
                      version.id === currentVersion && styles.versionSubtextSelected,
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
const HEIGHT = 40;

function BuildStyleSheet(theme: 'dark' | 'light') {
  const colors = STYLES.COLORS[theme];

  return StyleSheet.create({
    circleWrapper: {
      position: 'relative',
      width: WIDTH,
      height: HEIGHT,
      borderRadius: 21,
      backgroundColor: STYLES.COLORS[theme].BACKGROUND.SECONDARY,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 3,
    },
    circleText: {
      fontSize: 16,
      color: STYLES.COLORS[theme].TEXT.PRIMARY,
      fontFamily: STYLES.FONT.BOLD,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: STYLES.COLORS[theme].BACKGROUND.PRIMARY,
      borderRadius: 16,
      width: '85%',
      maxHeight: '70%',
      overflow: 'hidden',
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: STYLES.COLORS[theme].BACKGROUND.SECONDARY,
    },
    modalTitle: {
      fontSize: 18,
      color: STYLES.COLORS[theme].TEXT.PRIMARY,
      fontFamily: STYLES.FONT.BOLD,
    },
    closeButton: {
      fontSize: 21,
      color: STYLES.COLORS[theme].TEXT.SECONDARY,
    },
    scrollView: {
      maxHeight: '100%',
    },
    versionItem: {
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: colors.BACKGROUND.SECONDARY,
    },
    versionItemSelected: {
      backgroundColor: colors.BACKGROUND.SECONDARY,
    },
    versionText: {
      fontSize: 16,
      color: STYLES.COLORS[theme].TEXT.PRIMARY,
      fontFamily: STYLES.FONT.BOLD,
      marginBottom: 4,
    },
    versionTextSelected: {
      color: STYLES.COLORS[theme].TEXT.PRIMARY,
    },
    versionSubtext: {
      fontSize: 14,
      color: STYLES.COLORS[theme].TEXT.SECONDARY,
      fontFamily: STYLES.FONT.REGULAR,
    },
    versionSubtextSelected: {
      color: STYLES.COLORS[theme].TEXT.SECONDARY,
    },
  });
}
