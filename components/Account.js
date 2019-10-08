import React from 'react';
import {View, FlatList,Text} from 'react-native';
import {SQLite} from 'expo-sqlite';
import AsyncStorage from '@react-native-community/async-storage';

export default class accounts extends React.Component{
    constructor(props)
    {
        super(props);
        this.state={
            items:[]
        }
    }
    componentDidMount(){
        const getAccount=async()=>{
            try{
                const value=await AsyncStorage.getItem('categories');
                this.setState({items:value?JSON.parse(value):[{key:'0',title:'none'},{key:'1',title:"found"}]})
            }
            catch(e)
            {
                console.log("couldn't fetch categories")
            }
        }
        getAccount();
    }
    renderItem=({item:{title,}})=>{
        return(
            <View style={{justifyContent:"center",alignItems:"center"}}>
                <Text>{title}</Text>
            </View>
        )
    }
    render(){
        return(
            <View style={{justifyContent:"center",alignItems:"center"}}>
                <FlatList
                    data={this.state.items}
                    renderItem={this.renderItem}
                />
            </View>
        )
    }
} 