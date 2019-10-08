import React from "react";
import { View, Text,TextInput, StyleSheet, KeyboardAvoidingView,Alert,Modal } from "react-native";
import Button from './button';
import AsyncStorage from '@react-native-community/async-storage';
export default class HomeScreen extends React.Component {

  constructor(props)
  {
    super(props);
    this.state={
      users:[],
      userInput:"Astitva",
      passInput:"1234",
      user:"",
      pass:"",
      login:false,
      userPlace:"Username",
      passPlace:"Password",
    }
    this.passInput=null;
    
  }

  static navigationOptions=({navigation})=>{
    var visible=false;
    var modal=null;
    return {
      title:"Expendler",
      
    }
  }

  componentDidMount(){
    
      const getUser=async()=>{
        try{
        const value = await AsyncStorage.getItem('users');
        if(value)
        {
          this.setState({users:JSON.parse(value),login:true});
        }
        else
        {
          this.setState({login:false});
        }
      }
      
      catch(e)
      {
        console.log("user problem "+e);
      }
  }
  getUser(); 
  }

  handleUserInput=(text)=>{
    this.setState({userInput:text})
  }

  handlePasswordInput=(text)=>{
    this.setState({passInput:text})
  }


  handleLogin=()=>{
    const{userInput,passInput,users}=this.state;
    const user=users.find((item)=>{return(item.user===userInput)});
    if(user!==undefined && user.pass===passInput)
    {
      this.props.navigation.navigate("app");
      const setUser = async ()=>{
        try{
          await AsyncStorage.setItem('user',JSON.stringify(user.user))
        }
        catch(e)
        {
          console.log("error setting up user");
        }
      }
      setUser();
    }
    else if(user!==undefined && user.pass!==passInput)
    {
      Alert.alert(
        'Wrong Username/Password',
        'The username or password you entered is incorrect',
        [
          {text:"ok",onPress:()=>{this.setState({userInput:"",passInput:""})}},

        ],
        {cancelable:false}
      );
    }
    else{
      Alert.alert('User not found','No such user exists',[
        {text:"Ok",onPress:()=>{this.setState({userInput:"",passInput:""})}}
      ],{cancelable:false})
    }
  }

  handleSignUp=()=>{
    if(this.state.userInput==="" || this.state.passInput==="" )
    {
      Alert.alert("please enter valid username/password!");
    }

    const user=this.state.users.find((item)=>{return (item.user===this.state.userInput && item.pass===this.state.passInput)});
    if(user || user ===undefined)
    {
    const obj={user:this.state.userInput,pass:this.state.passInput};
    const setUser = async()=>{
      try{
        var value= await AsyncStorage.getItem('users');
        value=JSON.parse(value);

        await AsyncStorage.setItem("user",this.state.userInput.toString());
        await AsyncStorage.setItem("pass",this.state.passInput.toString());
        if(value && value!==undefined)
        {
          await AsyncStorage.setItem("users",JSON.stringify([...value,obj]));
        }
        else
        {
          await AsyncStorage.setItem("users",JSON.stringify([obj]));
        }
        const acc={assets:[],liab:[],capital:[]};
        await AsyncStorage.setItem(this.state.userInput.toString(),JSON.stringify(acc));
        this.props.navigation.navigate("app",{
          user:this.state.userInput,
        });
      }
      catch(e)
      {
        console.log("sign up problem"+e);
      }
    }
    setUser();
  }
  else
  {
    Alert.alert('User already exists','Please try to login instead',[
      {text:"Ok",style:"cancel"}
    ])
  }
  }
  
  render() {
    const {login}=this.state;
      return (
        <KeyboardAvoidingView style={{flex:1,justifyContent:"center",alignItems:"center"}}>

          <View style={{flex:1.5,justifyContent:"center",alignItems:"center"}}>
            <Text style={[styles.text,{fontSize:25,color:"green"}]}>Welcome</Text>
            <Text style={[styles.text,{fontSize:15,color:"green"}]}>Please Login</Text>
          </View>

          <View style={{flex:3,justifyContent:"center",alignItems:"center"}}>
            <View style={{flexDirection:"row",alignContent:"space-between",justifyContent:"center"}}>
            <TextInput 
              placeholder={this.state.userPlace}
              placeholderTextColor="black"
              value={this.state.userInput}
              style={styles.input} 
              onChangeText={this.handleUserInput}
              onFocus={()=>{this.setState({userPlace:""})}}
              onBlur={()=>{this.setState({userPlace:"Username"})}}
              onSubmitEditing={()=>{this.passInput.focus()}}
            />
          </View>
            
            <View style={{flexDirection:"row",alignContent:"space-between",justifyContent:"space-between"}}>
              <TextInput 
                placeholder={this.state.passPlace}
                placeholderTextColor="black"
                textContentType="password"
                style={styles.input} 
                secureTextEntry={true}
                onFocus={()=>{this.setState({passPlace:""})}}
                onBlur={()=>{this.setState({passPlace:"Password"})}}
                onChangeText={this.handlePasswordInput}
                ref={(c)=>{this.passInput=c}}
              />
            </View>

          </View>
          <View style={{flex:1.5,justifyContent:"flex-start",alignItems:"center"}}>
            {login && 
            <View style={{flexDirection:"row"}}>
            <Button
              title="Login"
              onPress={this.handleLogin}
              style={{marginRight:10}}
            />
            <Button title="Sign Up!" onPress={this.handleSignUp}/>
            </View>
            }
            {!login && 
            <Button 
              title="Sign Up!"
              onPress={this.handleSignUp}
            />
            }
          </View>
          
      
        </KeyboardAvoidingView>
      );
    }
  }
  const styles=StyleSheet.create({
    text:{
      margin:10,
      fontWeight:"600"
    },
    input:{
      borderWidth:1,
      borderRadius:15,
      height:35,
      width:100,
      marginBottom:20,
      textAlign:"center",

    }
  })