import { useState, useEffect } from 'react';
import { FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

import { createNewReading } from '@/lib/reading';
import { loadReadings } from '@/lib/storage';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';


export default function TabTwoScreen() {
  const [readings, setReadings] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchReadings = async () => {
      const data = await loadReadings();
      setReadings(data);
    };

    fetchReadings();
  }, []);

  const handleCreateReading = async () => {
    const id = await createNewReading('Untitled Reading');

    const updatedReadings = await loadReadings();
    setReadings(updatedReadings);

    router.push({
      pathname: '/readings/[id]',
      params: { id },
    });
  };


    return (
    <ThemedView style={{ flex: 1, padding: 16 }}>
      <ThemedText type="title" style={{ marginBottom: 16 }}>
        Reading List
      </ThemedText>

      <FlatList
        data={readings}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 16 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.readingCard}
            onPress={() =>
              router.push({
                pathname: '/readings/[id]',
                params: { id: item.id },
              })
            }
          >
            <Image
              source={item.pages[0]?.imageUri ? { uri: item.pages[0].imageUri } : require('@/assets/images/react-logo.png')}
              style={styles.thumbnail}
            />
            <ThemedText type="subtitle" numberOfLines={1} style={{ marginTop: 4 }}>
              {item.title}
            </ThemedText>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={handleCreateReading}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>

    </ThemedView>
  );
}

const styles = StyleSheet.create({
  readingCard: {
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  thumbnail: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    backgroundColor: '#ccc',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    alignSelf: 'center',
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },

});
