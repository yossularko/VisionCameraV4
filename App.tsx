/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {PropsWithChildren, useCallback, useRef, useState} from 'react';
import {
  Button,
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import {
  Camera,
  CameraRuntimeError,
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';
import Feather from 'react-native-vector-icons/Feather';

import {Colors} from 'react-native/Libraries/NewAppScreen';

interface ImageObj {
  name: string;
  uri: string;
  type: string;
}

interface CameraActionProps {
  icon: string;
  onPress: () => void;
  isActive: boolean;
}

const myToast = (message: string, long?: boolean) => {
  return ToastAndroid.show(
    message,
    long ? ToastAndroid.LONG : ToastAndroid.SHORT,
  );
};

const Wrapper = ({children}: PropsWithChildren) => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
  };
  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      {children}
    </SafeAreaView>
  );
};

const PermissionsPage = () => {
  const {requestPermission} = useCameraPermission();
  return (
    <Wrapper>
      <View>
        <Button title="Request Permission" onPress={requestPermission} />
      </View>
    </Wrapper>
  );
};

const NoCameraDeviceError = () => {
  return (
    <Wrapper>
      <View>
        <Text>No camera, device error</Text>
      </View>
    </Wrapper>
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

function App(): React.JSX.Element {
  const [image, setImage] = useState<ImageObj | null>(null);
  const [isTake, setIsTake] = useState(true);
  const [isFinded, setIsFinded] = useState(false);
  const [cameraPosition, setCameraPosition] = useState<'front' | 'back'>(
    'back',
  );
  const [flash, setFlash] = useState<'off' | 'on'>('off');

  const camera = useRef<Camera>(null);
  const device = useCameraDevice(cameraPosition);
  const {hasPermission} = useCameraPermission();

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
    setImage(null);
    setIsTake(true);
    setIsFinded(false);
  }, []);

  const onOk = useCallback(() => {
    setIsTake(false);
    setIsFinded(false);
  }, []);

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
        setIsFinded(true);
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

  if (!hasPermission) {
    return <PermissionsPage />;
  }

  if (device == null) {
    return <NoCameraDeviceError />;
  }

  return (
    <Wrapper>
      {isTake ? (
        <View style={{flex: 1, backgroundColor: 'black'}}>
          <StatusBar
            barStyle="light-content"
            translucent
            backgroundColor={'rgba(0,0,0,0)'}
          />
          <View style={styles.cameraContainer}>
            {isFinded ? (
              <Image
                source={{uri: image?.uri}}
                resizeMode="cover"
                style={{aspectRatio: 9 / 16}}
              />
            ) : (
              <Camera
                ref={camera}
                style={{aspectRatio: 9 / 16}}
                device={device}
                isActive={isTake && !isFinded}
                photo={true}
                onError={onError}
              />
            )}
          </View>
          <View style={styles.container}>
            <View style={styles.actionSection}>
              {isFinded ? (
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
      ) : (
        <ScrollView>
          <View style={{alignItems: 'center', gap: 10}}>
            <Image
              source={{uri: image?.uri}}
              resizeMode="cover"
              style={{aspectRatio: 3 / 4, width: 200}}
            />
            <Button title="Take a Photo" onPress={() => setIsTake(true)} />
          </View>
        </ScrollView>
      )}
    </Wrapper>
  );
}

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

export default App;
