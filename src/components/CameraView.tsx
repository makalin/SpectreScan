import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Alert } from 'react-native';
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import { useIRDetection } from '../services/IRDetectionService';

export const CameraView: React.FC = () => {
  const device = useCameraDevice('back');
  const camera = useRef<Camera>(null);
  const [isScanning, setIsScanning] = useState(false);
  const { startIRDetection, stopIRDetection, detectedReflections } = useIRDetection();

  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    const cameraPermission = await Camera.requestCameraPermission();
    if (cameraPermission !== 'granted') {
      Alert.alert('Permission Required', 'Camera access is required for scanning.');
    }
  };

  const handleStartScan = useCallback(async () => {
    if (!camera.current) return;
    
    setIsScanning(true);
    startIRDetection(camera.current);
  }, [startIRDetection]);

  const handleStopScan = useCallback(() => {
    setIsScanning(false);
    stopIRDetection();
  }, [stopIRDetection]);

  if (!device) {
    return (
      <View style={styles.container}>
        <Text>Camera not available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={camera}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        photo={true}
      />
      
      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.button, isScanning && styles.buttonActive]}
          onPress={isScanning ? handleStopScan : handleStartScan}
        >
          <Text style={styles.buttonText}>
            {isScanning ? 'Stop Scan' : 'Start Scan'}
          </Text>
        </TouchableOpacity>
      </View>

      {detectedReflections.length > 0 && (
        <View style={styles.detectionOverlay}>
          {detectedReflections.map((reflection, index) => (
            <View
              key={index}
              style={[
                styles.reflectionMarker,
                {
                  left: reflection.x,
                  top: reflection.y,
                },
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  controls: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  buttonActive: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  detectionOverlay: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: 'none',
  },
  reflectionMarker: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FF0000',
    backgroundColor: 'rgba(255, 0, 0, 0.3)',
  },
}); 