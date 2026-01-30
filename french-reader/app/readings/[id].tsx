import { StyleSheet, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { deleteReading as deleteReadingFromStorage, setActiveReadingId } from '@/lib/storage';
import { useEffect } from 'react';


import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
  


export default function ReadingCoverScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();

  useEffect(() => {
    console.log('[ReadingCover] canGoBack:', navigation.canGoBack());
  }, []);

  const deleteReading = async () => {
    await deleteReadingFromStorage(id);
    console.log("Deleting reading with ID:", id);
    router.push('/readings');
  };

  const openReading = async () => {
    setActiveReadingId(id as string);

    router.push({
      pathname: '/readings/[id]/reader',
      params: { id },
    });
  };


  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.coverCard}>
        <ThemedText type="title" style={styles.title}>
          Untitled Reading
        </ThemedText>

        <ThemedText style={styles.meta}>
          Created date, page count, etc.
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.actions}>
        <TouchableOpacity style={styles.primaryButton} onPress={openReading}>
          <ThemedText style={styles.primaryButtonText}>
            Open Reading
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton}>
          <ThemedText>Edit Title</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.dangerButton} onPress={deleteReading}>
          <ThemedText style={styles.dangerText}>
            Delete Reading
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },

  coverCard: {
    marginTop: 80,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.05)',
  },

  title: {
    textAlign: 'center',
    marginBottom: 8,
  },

  meta: {
    opacity: 0.6,
  },

  actions: {
    gap: 12,
    marginBottom: 24,
  },

  primaryButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },

  primaryButtonText: {
    color: 'white',
    fontWeight: '600',
  },

  secondaryButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.08)',
  },

  dangerButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: 'rgba(255,0,0,0.1)',
  },

  dangerText: {
    color: '#C00',
    fontWeight: '500',
  },
});
