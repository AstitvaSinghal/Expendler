import React from "react";
import {createStackNavigator,createAppContainer,createBottomTabNavigator, createSwitchNavigator} from 'react-navigation';
import DetailsScreen from './components/DetailsScreen';
import HomeScreen from './components/HomeScreen';
import history from './components/history';
import menu from './components/menu';
import Button from "./components/button";
import Card from "./components/Card";
import Settings from './components/userSettings'; 
import accounts from './components/Account';
import CameraScreen from "./components/CameraScreen";
const MainNavigator = createStackNavigator(
  {
    menu:menu,
    Details: DetailsScreen,
    history: history,
    settings:Settings,
    button:Button,
    accounts:accounts,
    camera:CameraScreen,
  },
  {
    defaultNavigationOptions:{
      title:"Expendler",
      
      headerStyle: {  
        backgroundColor: '#f4511e',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    },
    
  },
  

);

const authNavigator= createStackNavigator(
  {
    authScreen: HomeScreen,
  },
  {
    initialRouteName:"authScreen"
  }
);

const AppCont = createAppContainer(createSwitchNavigator(
  {
    Auth:authNavigator,
    app:MainNavigator,
  },
  {
    initialRouteName:"Auth"
  }
));

export default class App extends React.Component{
  render(){
    return (
     
    <AppCont />
    
   
    );
  }
}

