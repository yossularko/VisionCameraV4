/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {Provider} from 'jotai';
import Navigation from './src/navigation';

function App(): React.JSX.Element {
  return (
    <Provider>
      <Navigation />
    </Provider>
  );
}

export default App;
