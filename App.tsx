import React from 'react';
import AppLoading from 'expo-app-loading';
import { ThemeProvider } from 'styled-components'
import 'intl';
import 'intl/locale-data/jsonp/pt-BR';


import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold
} from '@expo-google-fonts/poppins';

import theme from './src/global/styles/theme'



import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "react-native";
import { AuthProvider } from './src/hooks/auth';
import { Routes } from './src/router';



export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold
  }) 

  if(!fontsLoaded) {
    return <AppLoading />
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider theme={theme}>
          <StatusBar barStyle="light-content" />
            <AuthProvider>
              <Routes />
            </AuthProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

