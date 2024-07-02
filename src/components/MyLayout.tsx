import {SafeAreaView, StatusBar, StatusBarStyle} from 'react-native';
import React, {PropsWithChildren} from 'react';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {useMyColorScheme} from '../hooks';

const MyLayout = ({children}: PropsWithChildren) => {
  const bg = useMyColorScheme(Colors.lighter, Colors.darker);
  const barStyle = useMyColorScheme<StatusBarStyle>(
    'dark-content',
    'light-content',
  );
  return (
    <SafeAreaView style={{backgroundColor: bg, flex: 1}}>
      <StatusBar barStyle={barStyle} backgroundColor={bg} />
      {children}
    </SafeAreaView>
  );
};

export default MyLayout;
