import { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { loadReadings } from '@/lib/storage';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import ActionSheet from '@/components/action-sheet';

export default function ReadingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [reading, setReading] = useState<any>(null);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [showFullImage, setShowFullImage] = useState(false);
  const [highlightOn, setHighlightOn] = useState(false);
  const [actionSheetVisible, setActionSheetVisible] = useState(false);
  const [selectedSectionText, setSelectedSectionText] = useState('');


  // handles the "temporarily" highlighted words
  const [highlightedWords, setHighlightedWords] = useState<Set<number>>(new Set());

  // handles the highlighted sections
  const [highlightedSections, setHighlightedSections] = useState<Set<Set<number>>>(new Set());

  useEffect(() => {
    const fetchReading = async () => {
      const data = await loadReadings();
      const r = data.find((r: any) => r.id === id);
      setReading(r);
      setCurrentPageIndex(0);
      setHighlightedWords(new Set());
    };
    fetchReading();
  }, [id]);

  if (!reading) return <ThemedText>Loading...</ThemedText>;
  if (reading.pages.length === 0)
    return <ThemedText>No pages yet in this reading.</ThemedText>;

  const page = reading.pages[currentPageIndex];
  const words = page.text.split(/\s+/);

  const goNext = () => {
    if (currentPageIndex < reading.pages.length - 1) {
      setCurrentPageIndex(i => i + 1);
      setHighlightedWords(new Set());
    }
  };

  const goPrev = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(i => i - 1);
      setHighlightedWords(new Set());
    }
  };

  const toggleHighlight = () => {
    // Saves the highlight and resets the temporary highlighted words
    if (highlightOn && highlightedWords.size > 0) {
      setHighlightedSections(prev => {
        const next = new Set(prev);
        next.add(highlightedWords);
        return next;
      });
      setHighlightedWords(new Set());
    }
    setHighlightOn(!highlightOn);
  };

  const toggleWord = (index: number) => {
    if (!highlightOn) return;

    setHighlightedWords(prev => {
      const next = new Set(prev);
      next.has(index) ? next.delete(index) : next.add(index);
      return next;
    });
  };

  // TODO: optimize code a little bit using this following function more often then needed
  const isHighlightedInHighlightedSections = (index: number) => {
    for (let section of highlightedSections) {
      if (section.has(index)) return true;
    }
    return false;
  };

  const isTextDisabled = (index: number) => {
    if (isHighlightedInHighlightedSections(index)) return false;
    return !highlightOn;
  };

  const handleTextPress = (index: number) => {
    for (let section of highlightedSections) {
      if (section.has(index)) {
        const sectionText = [...section]
          .sort((a, b) => a - b)
          .map(i => words[i])
          .join(' ');

        setSelectedSectionText(sectionText);
        setActionSheetVisible(true);
        return;
      }
    }

    toggleWord(index);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        {reading.title}
      </ThemedText>

      <ScrollView style={styles.scrollContainer}>
        <View style={styles.wordContainer}>
          {words.map((word: string, index: number) => (
            <TouchableOpacity
              key={index}
              activeOpacity={0.7}
              disabled={isTextDisabled(index)}
              onPress={() => handleTextPress(index)}
              style={[
                styles.word,
                highlightedWords.has(index) && styles.tempHighlightedWord,
                isHighlightedInHighlightedSections(index) && styles.highlightedSection,
              ]}
            >
              <ThemedText>{word + ' '}</ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Highlighter Toggle */}
      <TouchableOpacity onPress={toggleHighlight} style={styles.highlighterButton}>
        <FontAwesome5
          name="highlighter"
          size={28}
          color="black"
          style={{ opacity: highlightOn ? 0.3 : 1 }}
        />
      </TouchableOpacity>

      {/* Image viewer */}
      {page.imageUri && (
        <>
          <TouchableOpacity style={styles.imageIcon} onPress={() => setShowFullImage(true)}>
            <Image source={{ uri: page.imageUri }} style={styles.iconThumbnail} />
          </TouchableOpacity>

          <Modal visible={showFullImage} transparent animationType="fade">
            <Pressable style={styles.modalBackground} onPress={() => setShowFullImage(false)}>
              <Image source={{ uri: page.imageUri }} style={styles.fullImage} />
            </Pressable>
          </Modal>
        </>
      )}

      <ActionSheet
        visible={actionSheetVisible}
        text={selectedSectionText}
        onClose={() => setActionSheetVisible(false)}
        onTranslate={() => {
          console.log('Translate:', selectedSectionText);
        }}
        onGrammar={() => {
          console.log('Grammar:', selectedSectionText);
        }}
      />


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
  title: {
    marginBottom: 16,
    textAlign: 'center',
  },
  scrollContainer: {
    flex: 1,
  },
  wordContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  word: {
    paddingVertical: 2,
  },
  tempHighlightedWord: {
    backgroundColor: '#6b65448c',
    color: 'black',
    borderRadius: 4,
  },
  highlightedSection: {
    backgroundColor: '#FFD700',
    color: 'black',
    borderRadius: 0,
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
  highlighterButton: {
    position: 'absolute',
    bottom: 100,
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
  },
});