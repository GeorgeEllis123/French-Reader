import { useEffect, useState } from 'react';
import { ScrollView, Image, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { loadReadings } from '@/lib/storage';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';


export default function ReadingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [reading, setReading] = useState<any>(null);

  useEffect(() => {
    const fetchReading = async () => {
      const data = await loadReadings();
      const r = data.find((r: any) => r.id === id);
      setReading(r);
    };

    fetchReading();
  }, [id]);

  if (!reading) return <ThemedText>Loading...</ThemedText>;

  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
      <ThemedText type="title">{reading.title}</ThemedText>
      {reading.pages.map((page: any) => (
        <ThemedView key={page.id} style={{ marginVertical: 16 }}>
          {page.imageUri && <Image source={{ uri: page.imageUri }} style={styles.image} />}
          <ThemedText style={{ marginTop: 8 }}>{page.text}</ThemedText>
        </ThemedView>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 250,
    borderRadius: 8,
  },
});
