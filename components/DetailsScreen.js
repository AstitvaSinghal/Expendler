import React from "react";
import {Modal, View, Text,TextInput, StyleSheet,KeyboardAvoidingView,Alert,Image,TouchableOpacity } from "react-native";
import {SQLite} from 'expo-sqlite';
import Button from './button';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-community/async-storage';
import ImageButton from './ImageButton';
import {RNCamera} from 'react-native-camera';
export default class DetailsScreen extends React.Component {
    
    constructor(props)
    {
      super(props);
      this.state={
        to:"",
        from:"",
        amount:"",
        max:1,
        image:null,
        visible:false,
        comment:"",
      }
    }
   
  
  static navigationOptions=({navigation})=>{
      return{
          headerRight:(
            <TouchableOpacity onPress={()=>{navigation.navigate('settings')}}>
              <Image style={{width:10,height:10}} source={require('../assets/setting.png')}/>
            </TouchableOpacity>
        )
          }
  }

    componentDidMount(){
      db=SQLite.openDatabase(this.props.navigation.getParam('user'));
      db.transaction(tx=>{
        tx.executeSql(
          'create table if not exists astitva(id integer primary key, date text,debit text,credit text,amount int,comment text,image text)'
        );  
      },
      (e)=>{
        console.log(e);
      },
      ()=>{
        console.log(parseInt("astitva",10));
      }
      )
      const st=async ()=>{
        try{
          const value=await AsyncStorage.getItem("max");
          console.log("value "+value);
          if(typeof(value)!=="string" || parseInt(value)===1)
          {
            await AsyncStorage.setItem("max",JSON.stringify(this.state.max))
          }
          else
          {
            this.setState({max:parseInt(value)})
          } 
        }
         catch(e)
         {
           console.log(e);
         }
      }
      st();

    }

    handleTo=(text)=>{
      this.setState({to:text})
    }
    handleFrom=(text)=>{
      this.setState({from:text})
    }
    handleAmount=(text)=>{
      this.setState({amount:text});
    }
    getDate=()=>{
    var date = new Date().getDate(); //Current Date
    var month = new Date().getMonth() + 1; //Current Month
    var hours = new Date().getHours(); //Current Hours
    var min = new Date().getMinutes(); //Current Minutes
    
       date= date + '/' + month + ' ' + hours + ':' + min;
        console.log("Date= "+date);
        return date;
    }
    handleSubmit=()=>{
      if((typeof(this.state.to)!=="string" || this.state.to==="")||(typeof(this.state.from)!=="string" || this.state.from==="")||(typeof(this.state.amount)!=="string" || isNaN(parseInt(this.state.amount,10))))
      {
        Alert.alert(
          'Incomplete or wrong entry',
          'Some value you entered is incorrect,please try again',
          [
            {text:"ok",onPress:()=>{this.setState({to:"",from:"",amount:""})}},
          ],
          {cancelable:false}
        );
      }
      else{
        console.log("type= "+parseInt(this.state.amount,10));
      db.transaction(
        tx=>{
          const {max,to,from,amount,image,comment}=this.state;
          var date =this.getDate();
          tx.executeSql('insert into astitva(id,date,debit,credit,amount,comment,image) values(?,?,?,?,?,?,?)',[max,date.trim(),to.trim(),from.trim(),amount.trim(),comment,image]); 
          tx.executeSql("Select * from astitva",[],(_,rows)=>{
          console.log(JSON.stringify(rows.rows._array));
          })
        },
        (e)=>{
          console.log(e);
        },
        ()=>{
          console.log("Done");
          const {max}=this.state;
          this.setState({to:"",from:"",max:max+1,amount:"",comment:"",image:null})
          console.log("max="+this.state.max);
          const st=async()=>{
            try{
              await AsyncStorage.setItem("max",JSON.stringify(this.state.max));
            }
            catch(e)
            {
              console.log("error updating max");
            }
          }
          st();
        }
      );
    }
    }

    handleRemove=()=>{
      var sql='delete from astitva where';
      if(this.state.to!=="")
      {
        if(sql.slice(-5)==='where')
        {
          sql=sql+' debit="'+this.state.to.trim()+'"';
        }
        else
        {
          sql=sql+' and debit="'+this.state.to.trim()+'"';
        }
      }
      else if(this.state.from!=="")
      {
        if(sql.slice(-5)==='where')
        {
          sql=sql+' credit="'+this.state.from.trim()+'"';
        }
        else
        {
          sql=sql+' and credit="'+this.state.from.trim()+'"';
        }
      }
      else if(this.state.amount!=="")
      {
        if(sql.slice(-5)==='where')
        {
          sql=sql+' amount="'+this.state.amount.trim()+'"';
        }
        else
        {
          sql=sql+' and amount="'+this.state.amount.trim()+'"';
        }
      }
      else
      {
        Alert.alert(
          "Empty Entries",
          "Please enter something",
          [
            {text:"Ok",onPress:()=>{this.setState({to:"",from:"",amount:""})}}
          ],                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
          {cancelable:false}
        );
      }
      if(sql.slice(-5)!=='where')
      {
      db.transaction(
        tx=>{
          tx.executeSql(sql);
          tx.executeSql('select * from astitva',[],(_,rows)=>{
            console.log(JSON.stringify(rows));
          })
        },
        (e)=>{
          console.log(e);
        },
        ()=>{                                                                                                                                                                                                                                                                                                               
         console.log("deleted");
         this.setState({to:"",from:"",amount:""}); 
        }
      )
      }
    }

    handleImage=async ()=>{
      const image = await ImagePicker.launchImageLibraryAsync({
        allowsEditing:true,
        aspect:[4,3]
      });
      console.log(image);

      if(!image.cancelled)
      {
        this.setState({image:image.uri});
      }
      else
      {
        Alert.alert('Failed to pick image','Please try again',[
          {text:'ok',onPress:()=>{console.log("image pick up failed")}}
        ])
      }
    }
    handleComment=()=>{
      this.setState({visible:true})
    }
    render() {
      return (
        <KeyboardAvoidingView style={styles.kav} behavior="height" enabled>
          <Modal 
          visible={this.state.visible}
          animationType="fade"
          transparent={false}
          onRequestClose={()=>{this.setState({visible:false})}}>
            <TextInput 
            placeholder="Enter Comment" 
            multiline={true} 
            numberOfLines={10} 
            underlineColorAndroid="black" 
            onChangeText={(text)=>{this.setState({comment:text})}}
            onSubmitEditing={()=>{this.setState({visible:false})}}
            style={{textAlign:"left",textAlignVertical:"top"}}
            />
            <Button title="Submit" style={{width:100,alignSelf:"center"}} onPress={()=>{this.setState({visible:false})}}/>
          </Modal>
          <View style={[{flex:1},styles.views]}>
            <Text numberOfLines={1} style={[styles.text,{fontSize:20}]}>Please make an entry</Text>
          </View>
          
          <View style={{flex:4}}>
          <View style={{flex:2.5,flexDirection:"row",justifyContent:"center",alignItems:"center"}}>
          <View>
            <TextInput 
          value={this.state.to}
          style={styles.input} 
          onChangeText={this.handleTo}
          placeholder={"Debit"}
          />
          </View>
          
          <ImageButton style={{height:25,width:20,margin:10}} onPress={null} path={require("../assets/left.png")} />
            <View>
            <TextInput 
          value={this.state.from}
          style={styles.input} 
          onChangeText={this.handleFrom}
          placeholder={"Credit"}
          />
            </View>
          </View>
          
            
            <View style={[{flex:1.25,flexDirection:"row"},styles.views]}>
            <TextInput 
          keyboardType="number-pad"
          placeholder={"amount"}
          value={this.state.amount.toString()}
          style={styles.input} 
          onChangeText={this.handleAmount}
          />
            </View>
            <View style={{flex:1.25,justifyContent:"center",alignItems:"center",flexDirection:"column"}}>
              
              <Image style={{width:50,height:50,margin:10}} source={{uri:this.state.image}}/>
            </View>
            <View style={{flex:1.25,justifyContent:"center",alignItems:"center",flexDirection:"row"}}>
            <ImageButton style={{height:40,width:40,margin:10}} path={require("../assets/camera.png")} onPress={this.handleImage}/>
            <ImageButton style={{height:40,width:40,margin:10}} path={require("../assets/comment.png")} onPress={this.handleComment} />
            </View>
          </View>
          
          
         
            <View style={[{flex:1,flexDirection:"row"},styles.views]}>
            <Button onPress={this.handleSubmit} title={"Add"} style={{width:100,height:30,marginRight:10}}/>
            <Button onPress={this.handleRemove} title={"Clear Record"} style={{width:150,height:30}}/>
            </View>
            
            </KeyboardAvoidingView>
      );
    }
  }
  const styles=StyleSheet.create({
    views:{
      position:"relative",
      justifyContent:"center",
      alignItems:"center"
    },
    text:{
      margin:10,
      height:45,
      fontWeight:"600",
      color:"green",
    },
    input:{
      borderWidth:1,
      borderRadius:15,
      height:35,
      width:100,
      marginBottom:20,
      margin:10,
      textAlign:"center",

    },
    kav:{
      flex:1,
      flexDirection:"column",
      justifyContent:"center",
      alignItems:"center"
    }
  })
