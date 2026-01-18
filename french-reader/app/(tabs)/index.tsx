import { useRef, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
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

  // Camera screen
  const takePhoto = async () => {
    if (!cameraRef.current) return;
    const photo = await cameraRef.current.takePictureAsync();
    setPhotoUri(photo.uri);
    console.log('Photo URI:', photo.uri);
  };

  const uploadPhoto = async () => {
    if (!photoUri) return;

    console.log("Uploading photo...");

    const formData = new FormData();
    formData.append("image", {
      uri: photoUri,
      name: "photo.jpg",
      type: "image/jpeg",
    } as any);

    const response = await fetch("http://10.0.0.3:3000/ocr", {
      method: "POST",
      body: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const data = await response.json();
    console.log("OCR TEXT:", data.text);
};


  return (
    <View style={styles.container}>
      {photoUri ? (
        <View style={styles.photoContainer}>
          <Image source={{ uri: photoUri }} style={styles.photo} />
          <View style={styles.photoButtonContainer}>
            <TouchableOpacity style={styles.retakeButton} onPress={() => setPhotoUri(null)} />
            <TouchableOpacity style={styles.uploadButton} onPress={uploadPhoto} />
          </View>
        </View>
      ) : (
        <CameraView ref={cameraRef} style={styles.camera} facing={"back"}>
          <View style={styles.captureContainer}>
            <TouchableOpacity style={styles.captureButton} onPress={takePhoto} />
          </View>
        </CameraView>
      )}
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
  retakeButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'red',
  },
  uploadButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'green',
  },
  photoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photo: {
    flex: 1,
    width: '100%',
  },
  photoButtonContainer: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 40,
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
});
