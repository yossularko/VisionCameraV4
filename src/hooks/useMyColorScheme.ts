import {useColorScheme} from 'react-native';

const useMyColorScheme = <T>(light: T, dark: T) => {
  const isDarkMode = useColorScheme() === 'dark';

  if (isDarkMode) {
    return dark;
  }
  return light;
};

export default useMyColorScheme;
