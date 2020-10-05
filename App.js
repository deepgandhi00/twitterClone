import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';
import MainNavigator from './Navigators/mainNavigator';
import {createSwitchNavigator, createAppContainer} from "react-navigation";
import Login from './screens/Login';
import { isLogin } from './common/DefaulPreferencesHelper'
import LoadingScreen from './CommonComponents/LoadingScreen';
import { NavigationContainer } from '@react-navigation/native';

const App = () => {
  const [isChecked, setChecked] = useState(false);
  const [isLoggedin, setLogin] = useState(false);

  const Switch = createSwitchNavigator({
    Auth : {
      screen : Login
    },
    main : {
      screen : MainNavigator
    }
  },{
    initialRouteName : isLoggedin ? "main" : "Auth"
  });

  const AppContainer = createAppContainer(Switch)

  useEffect(() => [
    isLogin()
    .then((value) => {
      console.log(value);
      if(value){
        setLogin(true);
        setChecked(true);
      } else {
        setLogin(false);
        setChecked(true);
      }
    })
    .catch((error) => {
      console.log(error);
      setLogin(false);
      setChecked(true);
    })
  ],{})
  return (
    isChecked ?
    <NavigationContainer>
      <AppContainer/>
    </NavigationContainer>
       : <LoadingScreen/>
  );
};

export default App;
