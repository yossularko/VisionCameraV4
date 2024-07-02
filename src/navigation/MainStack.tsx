import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {DetectingFace, Home, ScanningBarcode, TakingPhoto} from '../screens';

const Stack = createNativeStackNavigator<MainStackParamList>();

const MainStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="TakingPhoto" component={TakingPhoto} />
      <Stack.Screen name="ScanningBarcode" component={ScanningBarcode} />
      <Stack.Screen name="DetectingFace" component={DetectingFace} />
    </Stack.Navigator>
  );
};

export default MainStack;
