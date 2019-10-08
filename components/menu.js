import React from "react";
import { View, Text,TextInput, StyleSheet, NavigationEvents,Alert } from "react-native";
import Button from './button';
import { SQLite } from "expo-sqlite";
import AsyncStorage from '@react-native-community/async-storage';

export default class menu extends React.Component {

   

    static navigationOptions=({navigation})=>{
        return{
            headerRight:(
            <Text
                style={{flex:1,margin:10,padding:3,fontSize:15,color:"white"}}
              onPress={()=>{navigation.navigate("Auth")}}
            >Sign Out</Text>
          )
            }
    }

    constructor(props)
    {
      super(props);
      this.state={
        user:null,
      }
    }
    componentDidMount(){
      const getUser=async()=>{
        try{
          const value= await AsyncStorage.getItem('user');
          this.setState({user:value});
          console.log('user='+this.state.user);
        }
        catch(e)
        {
          console.log(e);
          Alert.alert('Sorry,could not load database',[
            {text:"ok",onPress:()=>{
              this.props.navigation.navigate('Auth');
            }}
          ],{cancelable:false})
        }
      }
      getUser();
     
    }
    handleHistory=()=>{
        this.props.navigation.navigate("history",{user:this.state.user})
      }
    handleDetails=()=>{
        this.props.navigation.navigate("Details",{user:this.state.user});
    }
    handleAccounts=()=>{
      this.props.navigation.navigate('accounts')
    }
    handleCamera=()=>{
      this.props.navigation.navigate('camera')
    }
    render(){
        return(
            <View style={styles.container}>
            <Button 
              title="Make an Entry!"
              onPress={this.handleDetails}
            />
            <Button 
              title="See Transactions!"
              onPress={this.handleHistory}
            />
            <Button
              title="Manage Accounts"
              onPress={this.handleAccounts}
            />
            <Button
              title="Open Camera"
              onPress={this.handleCamera}
            />
            </View>
        )
    }
}

const styles=StyleSheet.create({
    container:{
        flex:1,
        alignItems:"center",
        justifyContent:"center",
       
    },
})