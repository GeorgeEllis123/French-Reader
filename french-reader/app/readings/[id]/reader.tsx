import { useEffect, useState } from 'react';
import { View, ScrollView, Image, StyleSheet, TouchableOpacity, Modal, Pressable } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { loadReadings } from '@/lib/storage';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';

export default function ReadingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [reading, setReading] = useState<any>(null);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [showFullImage, setShowFullImage] = useState(false);

  useEffect(() => {
    const fetchReading = async () => {
      const data = await loadReadings();
      const r = data.find((r: any) => r.id === id);
      setReading(r);
      setCurrentPageIndex(0); // TODO: Change to the last read page index
    };
    fetchReading();
  }, [id]);

  if (!reading) return <ThemedText>Loading...</ThemedText>;
  if (reading.pages.length === 0)
    return <ThemedText>No pages yet in this reading.</ThemedText>;

  const page = reading.pages[currentPageIndex];

  const goNext = () => {
    if (currentPageIndex < reading.pages.length - 1) setCurrentPageIndex(currentPageIndex + 1);
  };
  const goPrev = () => {
    if (currentPageIndex > 0) setCurrentPageIndex(currentPageIndex - 1);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        {reading.title}
      </ThemedText>

      <ScrollView style={styles.scrollContainer}>
        <ThemedText style={styles.text}>{page.text}</ThemedText>
      </ScrollView>

      {page.imageUri && (
        <>
          <TouchableOpacity style={styles.imageIcon} onPress={() => setShowFullImage(true)}>
            <Image source={{ uri: page.imageUri }} style={styles.iconThumbnail} />
          </TouchableOpacity>

          <Modal visible={showFullImage} transparent={true} animationType="fade">
            <Pressable style={styles.modalBackground} onPress={() => setShowFullImage(false)}>
              <Image source={{ uri: page.imageUri }} style={styles.fullImage} />
            </Pressable>
          </Modal>
        </>
      )}

      <ThemedView style={styles.navigation}>
        <TouchableOpacity onPress={goPrev} disabled={currentPageIndex === 0} style={styles.navButton}>
          <ThemedText style={{ opacity: currentPageIndex === 0 ? 0.3 : 1 }}>◀ Previous</ThemedText>
        </TouchableOpacity>

        <ThemedText>
          {currentPageIndex + 1} / {reading.pages.length}
        </ThemedText>

        <TouchableOpacity onPress={goNext} disabled={currentPageIndex === reading.pages.length - 1} style={styles.navButton}>
          <ThemedText style={{ opacity: currentPageIndex === reading.pages.length - 1 ? 0.3 : 1 }}>Next ▶</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
  },
  scrollContainer: {
    flex: 1,
  },
  text: {
    fontSize: 16,
  },
  imageIcon: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 40,
    height: 40,
  },
  iconThumbnail: {
    width: 40,
    height: 40,
    borderRadius: 4,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: '90%',
    height: '70%',
    borderRadius: 12,
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  navButton: {
    padding: 8,
  },
});
