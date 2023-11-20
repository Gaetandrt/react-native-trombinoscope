
import { NavigationContainer } from '@react-navigation/native';
import Navigation_bar from './src/screens/Footer';
import React, { useEffect, useState } from 'react';
import { useFonts } from 'expo-font';

const App = () => {
  let [fontsLoaded] = useFonts({
    "FredokaOne": require("././assets/fonts/FredokaOne-Regular.ttf"),
    "InterRegular": require("././assets/fonts/Inter-Regular.ttf"),
    "InterMedium": require("././assets/fonts/Inter-Medium.ttf"),
    "InterSemiBold": require("././assets/fonts/Inter-SemiBold.ttf"),
    "InterBold": require("././assets/fonts/Inter-Bold.ttf"),
  });

  return (
      <NavigationContainer>
        <Navigation_bar />
      </NavigationContainer>
  );
};

export default App;
