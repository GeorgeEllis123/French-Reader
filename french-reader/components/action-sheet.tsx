import { View, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

type Props = {
  visible: boolean;
  text: string;
  onClose: () => void;
  onTranslate: () => void;
  onGrammar: () => void;
};

export default function ActionSheet({
  visible,
  text,
  onClose,
}: Props) {
  const onTranslate = () => {
    console.log('Translating:', text);
  };

  const onGrammar = () => {
    console.log('Showing grammar for:', text);
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
            <TouchableOpacity style={styles.actionButton} onPress={onTranslate}>
              <ThemedText>Translate</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={onGrammar}>
              <ThemedText>Grammar</ThemedText>
            </TouchableOpacity>
          </View>

          {/* Response Text */}
          
        </ThemedView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  sheet: {
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  close: {
    fontSize: 18,
    fontWeight: '600',
  },
  selectedText: {
    flex: 1,
    textAlign: 'center',
    paddingHorizontal: 12,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.08)',
  },
});
