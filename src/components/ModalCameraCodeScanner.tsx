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
  Camera,
  CameraRuntimeError,
  useCameraDevice,
  useCodeScanner,
} from 'react-native-vision-camera';
import {myToast} from '../utils/myToast';

interface Props {
  visible: boolean;
  onClose: () => void;
  onFound: (code: string) => void;
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

const ModalCameraCodeScanner = ({visible, onClose, onFound}: Props) => {
  const [code, setCode] = useState('');
  const device = useCameraDevice('back');

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: codes => {
      if (codes.length > 0) {
        setCode(codes[0].value || '');
      }
    },
  });

  const onError = useCallback((error: CameraRuntimeError) => {
    console.log('Error Camera: ', error);
    myToast(error.message);
  }, []);

  const findQrCode = useRef<(code: string) => void>(() => {});
  findQrCode.current = qrcode => {
    onFound(qrcode);
    onClose();
  };

  useEffect(() => {
    if (visible && code) {
      findQrCode.current(code);
    }
  }, [visible, code]);

  useEffect(() => {
    if (!visible) {
      setCode('');
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
              style={{aspectRatio: 9 / 16}}
              device={device}
              codeScanner={codeScanner}
              isActive={visible}
              onError={onError}
            />
          </View>
          <View style={styles.container}>
            <View style={styles.actionSection}>
              <Text style={{marginTop: 10}}>Sacanning..</Text>
            </View>
          </View>
        </View>
      )}
    </Modal>
  );
};

export default ModalCameraCodeScanner;

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
