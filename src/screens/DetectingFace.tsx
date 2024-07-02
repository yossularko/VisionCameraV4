import {Button, Image, ScrollView, StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ModalCameraFaceDetection, MyLayout} from '../components';
import {useDisclosure} from '../hooks';

type Props = NativeStackScreenProps<MainStackParamList, 'DetectingFace'>;

const DetectingFace = ({}: Props) => {
  const [image, setImage] = useState<ImageObj | null>(null);
  const {isOpen, onOpen, onClose} = useDisclosure();
  return (
    <MyLayout>
      <ModalCameraFaceDetection
        visible={isOpen}
        onClose={onClose}
        onFound={val => setImage(val)}
      />
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          {image ? (
            <Image
              source={{uri: image.uri}}
              resizeMode="cover"
              style={{aspectRatio: 3 / 4, width: 200}}
            />
          ) : null}
          <Button title="Detect Face" onPress={onOpen} />
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

export default DetectingFace;
