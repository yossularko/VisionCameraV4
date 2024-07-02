import {Text, Button, View, StyleSheet} from 'react-native';
import React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useMyColorScheme} from '../hooks';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {MyLayout} from '../components';

type Props = NativeStackScreenProps<MainStackParamList, 'Home'>;

const Home = ({navigation}: Props) => {
  const text = useMyColorScheme(Colors.darker, Colors.lighter);
  return (
    <MyLayout>
      <View style={styles.container}>
        <Text style={[styles.welcome, {color: text}]}>
          Welcome to Vision Camera V4 Example
        </Text>
        <Button
          title="Take a Photo"
          onPress={() => navigation.navigate('TakingPhoto')}
        />
        <Button
          title="Scan QR Code"
          onPress={() => navigation.navigate('ScanningBarcode')}
        />
        <Button
          title="Detecting Face"
          onPress={() => navigation.navigate('DetectingFace')}
        />
      </View>
    </MyLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  welcome: {
    fontSize: 16,
    paddingHorizontal: 24,
    textAlign: 'center',
  },
});

export default Home;
