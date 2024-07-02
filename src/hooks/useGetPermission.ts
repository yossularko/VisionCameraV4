import {useEffect, useRef} from 'react';
import {useCameraPermission} from 'react-native-vision-camera';
import {myToast} from '../utils/myToast';

interface Config {
  onFinish?: () => Promise<void>;
}

const useGetPermission = ({onFinish}: Config) => {
  const {hasPermission, requestPermission} = useCameraPermission();
  const savedOnFinish = useRef<() => Promise<void>>(async () => {});

  savedOnFinish.current = async () => {
    if (onFinish) {
      await onFinish();
    }
  };

  useEffect(() => {
    const getCamerPerm = async () => {
      if (hasPermission) {
        return;
      }

      const cameraRequest = await requestPermission();
      if (cameraRequest) {
        myToast('Permission Camera Authorized');
        return;
      }
    };

    const getPermissions = async () => {
      await getCamerPerm();
      await savedOnFinish.current();
    };

    getPermissions();
  }, [hasPermission, requestPermission]);
};

export default useGetPermission;
