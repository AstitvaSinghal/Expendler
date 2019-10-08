import React from 'react';
import {View,Text,StyleSheet,TouchableOpacity,Modal,Image,Alert} from 'react-native';
import {SQlite} from 'expo-sqlite';

export default class Card extends React.Component{
    constructor(props){
        super(props);
        this.state={
            visible:false,
        }
    }
    handleVisibility=()=>{
        if(this.state.visible===false)
        {
            if(this.props.debit!=="Debit")
            {
                this.setState({visible:true});
            }
            else{
                console.log(this.props.debit);
            }
            console.log(this.props.image)
        }
        else
        {
            this.setState({visible:false});
        }
    }

    handleLongPress=()=>{
        Alert.alert(
            'Delete',
            'Are you sure to delete this record',
            [
                {text:'Yes',onPress:()=>{this.props.onLongPress(this.props.id)}},
                {text:'Cancel',style:'cancel'}
            ],
            {}
        );
    }
    render(){
        var {date,debit,credit,amount,image,comment,onLongPress}=this.props;
        var comment= comment===""?"No Comments":comment;
        return(
        <View style={styles.container}>
            <Modal
            animationType="fade"
            transparent={false}
            onRequestClose={this.handleVisibility}
            visible={this.state.visible}
            >
                <View style={styles.modalView}>
                    <View style={{flex:1,marginTop:20}}>
                        {image && <Image style={{height:250,width:300}} source={{uri:image}}/>}
                        {!image && <Image style={{height:250,width:300}} source={require("../assets/icon.png")}/> }

                    </View>
                    <View style={{flex:1,justifyContent:"center"}}>
                        <View style={{flex:1,flexDirection:"row",justifyContent:"space-between",alignItems:"center",width:300}}>
                            <Text style={{marginLeft:30,fontSize:20}}>Date:</Text>
                            <Text style={{marginRight:30,fontSize:20}}>{date}</Text>
                        </View>
                        <View style={{flex:1,flexDirection:"row",justifyContent:"space-between",alignItems:"center",width:300}}>
                            <Text style={{marginLeft:30,fontSize:20}}>Debit:</Text>
                            <Text style={{marginRight:30,fontSize:20}}>{debit}</Text>
                        </View>
                        <View style={{flex:1,flexDirection:"row",justifyContent:"space-between",alignItems:"center",width:300}}>
                            <Text style={{marginLeft:30,fontSize:20}}>Credit:</Text>
                            <Text style={{marginRight:30,fontSize:20}}>{credit}</Text>
                        </View>
                        <View style={{flex:1,flexDirection:"row",justifyContent:"space-between",alignItems:"center",width:300}}>
                            <Text style={{marginLeft:30,fontSize:20}}>Amount:</Text>
                            <Text style={{marginRight:30,fontSize:20}}>{amount}</Text>
                        </View>
                    </View>
                    
                    <View style={{flex:0.5,justifyContent:"center"}}>
                        <Text style={{borderWidth:1,flex:1,width:300,paddingVertical:10,paddingHorizontal:5}} onPress={()=>{this.setState({visible:false});}}>{comment}</Text>
                    </View>
                    
                </View>
            </Modal>
            
            <TouchableOpacity style={styles.top} onPress={this.handleVisibility} onLongPress={this.handleLongPress}>
                <Text adjustsFontSizeToFit={true} style={styles.text}>{date}</Text>
                <Text numberOfLines={1} style={styles.text}>{debit}</Text>
                <Text numberOfLines={1} style={styles.text}>{credit}</Text>
                <Text numberOfLines={1} style={styles.text}>{amount}</Text>
            </TouchableOpacity>
            
        </View>
        )    
    }
}

styles=StyleSheet.create({
    container:{
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"center",
       height:40,
    
    },
    top:{
        height:40,
        width:340,
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"center",
    },
    text:{
        margin:10,
        width:70,
    },
    modalView:{
        flex:1,
        justifyContent:"center",
        alignItems:"center",

    }
})