import {Text} from 'react-native';
import React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useMyColorScheme} from '../hooks';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {MyLayout} from '../components';

type Props = NativeStackScreenProps<MainStackParamList, 'ScanningBarcode'>;

const ScanningBarcode = ({}: Props) => {
  const text = useMyColorScheme(Colors.darker, Colors.lighter);
  return (
    <MyLayout>
      <Text style={{color: text}}>ScanningBarcode</Text>
    </MyLayout>
  );
};

export default ScanningBarcode;
