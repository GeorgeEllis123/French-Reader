import { useState, useEffect } from 'react';
import { FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

import { loadReadings } from '@/lib/storage';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';


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
});
