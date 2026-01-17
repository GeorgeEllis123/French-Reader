import { useRef, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';

export default function HomeScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  // Still loading permission
  if (!permission) {
    return <View />;
  }

  // Permission not granted yet
  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={{ marginBottom: 12 }}>We need camera access</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.permissionButton}>
          <Text style={{ color: 'white' }}>Grant permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Photo preview screen
  if (photoUri) {
    return (
      <View style={styles.container}>
        <Text style={styles.previewText}>Photo captured</Text>
        <TouchableOpacity style={styles.retakeButton} onPress={() => setPhotoUri(null)}>
          <Text style={{ color: 'white' }}>Retake</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Camera screen
  const takePhoto = async () => {
    if (!cameraRef.current) return;
    const photo = await cameraRef.current.takePictureAsync();
    setPhotoUri(photo.uri);
    console.log('Photo URI:', photo.uri);
  };

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing={"back"}>
        <View style={styles.captureContainer}>
          <TouchableOpacity style={styles.captureButton} onPress={takePhoto} />
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  captureContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 40,
  },
  captureButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'white',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionButton: {
    backgroundColor: 'black',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  previewText: {
    color: 'white',
    textAlign: 'center',
    marginTop: 40,
  },
  retakeButton: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: 'black',
    padding: 12,
    borderRadius: 8,
  },
});
