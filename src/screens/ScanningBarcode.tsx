import {Button, ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useDisclosure, useMyColorScheme} from '../hooks';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {ModalCameraCodeScanner, MyLayout} from '../components';

type Props = NativeStackScreenProps<MainStackParamList, 'ScanningBarcode'>;

const ScanningBarcode = ({}: Props) => {
  const [code, setCode] = useState('');
  const {isOpen, onOpen, onClose} = useDisclosure();
  const text = useMyColorScheme(Colors.darker, Colors.lighter);
  return (
    <MyLayout>
      <ModalCameraCodeScanner
        visible={isOpen}
        onClose={onClose}
        onFound={val => setCode(val)}
      />
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          {code ? <Text style={{color: text}}>Code: {code}</Text> : null}
          <Button title="Scan Code" onPress={onOpen} />
        </View>
      </ScrollView>
    </MyLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
  },
  content: {
    marginTop: 20,
    alignItems: 'center',
    gap: 10,
  },
});

export default ScanningBarcode;
