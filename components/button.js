import React from 'react';
import {View,TouchableOpacity,Text,StyleSheet} from 'react-native';

export default class Button extends React.Component{
    render(){
        const {title,onPress,style}=this.props;
        return(
            <TouchableOpacity style={[styles.input,style]} onPress={onPress}>
                <Text style={styles.text}>{title}</Text>
            </TouchableOpacity>
        )
    }
}
const styles=StyleSheet.create({
    input:{
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#336633',
    paddingRight:5,
    paddingLeft:5,
    marginTop: 10,
    borderRadius:15,
    justifyContent:"center",
    alignItems:"center"
    },
    text:{
    alignSelf: 'center',
    color: '#336633',
    fontSize: 16,
    fontWeight: '600',
    paddingTop: 10,
    paddingBottom: 10
    }
})