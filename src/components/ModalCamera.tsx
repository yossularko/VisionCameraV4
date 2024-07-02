import {
  ActivityIndicator,
  Dimensions,
  Image,
  Modal,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useRef, useState} from 'react';
import {
  Camera,
  CameraRuntimeError,
  useCameraDevice,
} from 'react-native-vision-camera';
import Feather from 'react-native-vector-icons/Feather';
import {myToast} from '../utils/myToast';

interface Props {
  visible: boolean;
  onClose: () => void;
  onFinish: (img: ImageObj) => void;
  position?: 'front' | 'back';
}

interface CameraActionProps {
  icon: string;
  onPress: () => void;
  isActive: boolean;
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

const CameraAction = ({icon, onPress, isActive}: CameraActionProps) => {
  return (
    <TouchableOpacity
      style={[styles.actionButton, {opacity: isActive ? 1 : 0}]}
      onPress={onPress}
      disabled={!isActive}>
      <Feather name={icon} color="white" size={22} />
    </TouchableOpacity>
  );
};

const ModalCamera = ({visible, onClose, onFinish, position}: Props) => {
  const [image, setImage] = useState<ImageObj>({} as ImageObj);
  const [cameraPosition, setCameraPosition] = useState(position || 'back');
  const [flash, setFlash] = useState<'off' | 'on'>('off');

  const camera = useRef<Camera>(null);
  const device = useCameraDevice(cameraPosition);

  const supportsFlash = device?.hasFlash ?? false;

  const toggleFlash = useCallback(() => {
    if (flash === 'off') {
      setFlash('on');
      return;
    }

    setFlash('off');
  }, [flash]);

  const toggleFlip = useCallback(() => {
    if (cameraPosition === 'back') {
      setCameraPosition('front');
      return;
    }

    setCameraPosition('back');
  }, [cameraPosition]);

  const onRetry = useCallback(() => {
    setImage({} as ImageObj);
  }, []);

  const onOk = useCallback(() => {
    onFinish(image);
    onClose();
    setTimeout(() => {
      setImage({} as ImageObj);
    }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [image]);

  const takePic = useCallback(async () => {
    try {
      const photo = await camera.current?.takePhoto({
        flash: flash,
        enableShutterSound: false,
      });

      if (photo) {
        const {path} = photo;
        const namaFile = path.substring(path.lastIndexOf('/') + 1, path.length);

        setImage({
          uri: `file://${path}`,
          name: namaFile,
          type: 'image/jpeg',
        });
      }
    } catch (err: any) {
      if (
        String(err) === '[unknown/unknown]: [unknown/unknown] No flash unit'
      ) {
        setFlash('off');
        myToast('Flash dinonaktifkan');
        console.log('error Flash: ', err);
        return;
      }
      console.log('error capture: ', String(err));
    }
  }, [flash]);

  const onError = useCallback((error: CameraRuntimeError) => {
    console.log('Error Camera: ', error);
    myToast(error.message);
  }, []);

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
            {image.uri ? (
              <Image
                source={{uri: image.uri}}
                resizeMode="cover"
                style={{aspectRatio: 9 / 16}}
              />
            ) : (
              <Camera
                ref={camera}
                style={{aspectRatio: 9 / 16}}
                device={device}
                isActive={visible}
                photo={true}
                onError={onError}
              />
            )}
          </View>
          <View style={styles.container}>
            <View style={styles.actionSection}>
              {image.uri ? (
                <>
                  <TouchableOpacity onPress={onRetry}>
                    <Text style={styles.confirmButton}>Ulangi</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={onOk}>
                    <Text style={styles.confirmButton}>Ok</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <CameraAction
                    icon={flash === 'on' ? 'zap' : 'zap-off'}
                    onPress={toggleFlash}
                    isActive={supportsFlash}
                  />
                  <TouchableOpacity style={styles.capture} onPress={takePic} />
                  <CameraAction
                    icon="repeat"
                    onPress={toggleFlip}
                    isActive={true}
                  />
                </>
              )}
            </View>
          </View>
        </View>
      )}
    </Modal>
  );
};

export default ModalCamera;

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
