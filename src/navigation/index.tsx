import {View, Text} from 'react-native';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {useAtom} from 'jotai';
import {loadingAtom} from '../store/mainStore';
import {useGetPermission} from '../hooks';
import MainStack from './MainStack';
import {MyLayout} from '../components';

const Navigation = () => {
  const [loading, setIsloading] = useAtom(loadingAtom);

  useGetPermission({
    onFinish: async () => {
      setIsloading(false);
    },
  });

  if (loading) {
    return (
      <MyLayout>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text>Loading App..</Text>
        </View>
      </MyLayout>
    );
  }

  return (
    <NavigationContainer>
      <MainStack />
    </NavigationContainer>
  );
};

export default Navigation;
