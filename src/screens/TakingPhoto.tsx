import {Button, Image, ScrollView, StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useDisclosure} from '../hooks';
import {ModalCamera, MyLayout} from '../components';

type Props = NativeStackScreenProps<MainStackParamList, 'TakingPhoto'>;

const TakingPhoto = ({}: Props) => {
  const [image, setImage] = useState<ImageObj | null>(null);
  const {isOpen, onOpen, onClose} = useDisclosure();
  return (
    <MyLayout>
      <ModalCamera
        visible={isOpen}
        onClose={onClose}
        onFinish={val => setImage(val)}
        position="back"
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
          <Button title="Take a Photo" onPress={onOpen} />
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

export default TakingPhoto;
