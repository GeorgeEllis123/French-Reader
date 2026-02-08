import { View, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useState } from 'react';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

// TODO: save the translations as to not waste API calls

type Props = {
  visible: boolean;
  text: string;
  onClose: () => void; // TODO: make it so when it closes all of the text is reset
};

export default function ActionSheet({
  visible,
  text,
  onClose,
}: Props) {
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onTranslate = async () => {
    setLoading(true);

    try {
      const res = await fetch('http://10.0.0.3:3000/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();
      setResponse(data.translation);
    } catch (e) {
      console.log('Translation error:', e);
      setResponse('Translation failed.');
    } finally {
      setLoading(false);
    }
  };


  const onGrammar = () => {
    const msg = `Showing grammar for: ${text}`;
    console.log(msg);
    setResponse(msg);
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <ThemedView style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <ThemedText style={styles.close}>✕</ThemedText>
            </TouchableOpacity>

            <ThemedText style={styles.selectedText} numberOfLines={3}>
              {text}
            </ThemedText>

            <View style={{ width: 24 }} />
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.actionButton, styles.translateButton]}
              onPress={onTranslate}
            >
              <ThemedText style={styles.actionText}>Translate</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.grammarButton]}
              onPress={onGrammar}
            >
              <ThemedText style={styles.actionText}>Grammar</ThemedText>
            </TouchableOpacity>
          </View>

          {/* Response Text */}
          {response && (
            <View style={styles.responseBox}>
              <ThemedText style={styles.responseText}>{response}</ThemedText>
            </View>
          )}
        </ThemedView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.45)',
  },

  sheet: {
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#1e1e1e', // dark sheet
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },

  close: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },

  selectedText: {
    flex: 1,
    textAlign: 'center',
    paddingHorizontal: 12,
    color: '#ffffff',
    fontWeight: '500',
  },

  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  actionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },

  translateButton: {
    backgroundColor: '#3b82f6', // blue
    marginRight: 8,
  },

  grammarButton: {
    backgroundColor: '#22c55e', // green
    marginLeft: 8,
  },

  actionText: {
    color: '#ffffff',
    fontWeight: '600',
  },

  response: {
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#2a2a2a',
  },

  responseBox: {
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#2a2a2a',
  },

  responseText: {
    color: '#e5e5e5',
    fontSize: 14,
    lineHeight: 20,
  },
});