import {
  ActivityIndicator,
  Dimensions,
  Modal,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Frame,
  Camera as CameraV,
  CameraRuntimeError,
  useCameraDevice,
} from 'react-native-vision-camera';
import {myToast} from '../utils/myToast';
import {
  Face,
  Camera,
  FaceDetectionOptions,
} from 'react-native-vision-camera-face-detector';

interface Props {
  visible: boolean;
  onClose: () => void;
  onFound: (code: ImageObj) => void;
}

const invisibleColor = 'rgba(255, 255, 255, 0)';

const LoadingView = () => {
  return (
    <View style={styles.waitingContainer}>
      <ActivityIndicator size="large" color="white" />
      <Text style={{color: 'white', fontSize: 16}}>Waiting Camera</Text>
    </View>
  );
};

const ModalCameraFaceDetection2 = ({visible, onClose, onFound}: Props) => {
  const [isDetected, setIsDetected] = useState(false);

  const camera = useRef<CameraV>(null);
  const faceDetectionOptions = useRef<FaceDetectionOptions>({
    // detection options
    performanceMode: 'fast',
  }).current;

  const device = useCameraDevice('front');

  const handleDetectedFaces = (faces: Face[], frame: Frame) => {
    console.log('faces', faces.length, 'frame', frame.toString());
    if (faces.length === 0) {
      setIsDetected(false);
    } else {
      setIsDetected(true);
    }
  };

  const onError = useCallback((error: CameraRuntimeError) => {
    console.log('Error Camera: ', error);
    myToast(error.message);
  }, []);

  const takePic = useRef(async () => {});
  takePic.current = async () => {
    try {
      const photo = await camera.current?.takePhoto({
        enableShutterSound: false,
      });

      if (photo) {
        const {path} = photo;
        const namaFile = path.substring(path.lastIndexOf('/') + 1, path.length);

        const dataPhoto = {
          uri: `file://${path}`,
          name: namaFile,
          type: 'image/jpeg',
        };

        onFound(dataPhoto);
        onClose();
      }
    } catch (err: any) {
      console.log('error capture: ', String(err));
    }
  };

  useEffect(() => {
    if (isDetected) {
      takePic.current();
    }
  }, [isDetected]);

  useEffect(() => {
    if (!visible) {
      setIsDetected(false);
    }
  }, [visible]);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
      statusBarTranslucent>
      {!device ? (
        <LoadingView />
      ) : (
        <View style={{flex: 1, backgroundColor: 'black'}}>
          <StatusBar
            barStyle="light-content"
            translucent
            backgroundColor={invisibleColor}
          />
          <View style={styles.cameraContainer}>
            <Camera
              ref={camera}
              style={{aspectRatio: 9 / 16}}
              device={device}
              isActive={visible}
              faceDetectionCallback={handleDetectedFaces}
              faceDetectionOptions={faceDetectionOptions}
              photo={true}
              onError={onError}
            />
          </View>
          <View style={styles.container}>
            <View style={styles.actionSection}>
              <Text style={{marginTop: 10}}>Detecting face2..</Text>
            </View>
          </View>
        </View>
      )}
    </Modal>
  );
};

export default ModalCameraFaceDetection2;

const ScreenHeight = Dimensions.get('window').height;
const ScreenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  waitingContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraContainer: {
    position: 'absolute',
    width: ScreenWidth,
    height: ScreenHeight,
    paddingTop: ScreenHeight * 0.07,
  },
  actionSection: {
    backgroundColor: 'rgba(21, 21, 21, 0.25)',
    height: 200,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  actionButton: {
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 14,
    padding: 8,
  },
  confirmButton: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 22,
  },
  capture: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
  },
});
