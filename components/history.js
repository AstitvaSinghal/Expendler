import React from 'react';
import {View,Text,FlatList,TextInput,Alert} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import {SQLite} from 'expo-sqlite';
import Card from './Card';
import Button from './button';
const keyExtractor=({id})=>id.toString();
var db=null;
export default class history extends React.Component{
    constructor(props)
    {
        super(props);
        this.state={
            items:[{id:0,date:"Date",debit:"Debit",credit:"Credit",amount:"Amount"}],
            search:"",
            place:"Search"
        }
    }
    

    static navigationOptions=({navigation})=>{
        return{
            headerRight:(
                <View style={{flexDirection:"row"}}>
                       
                        <Text
                            style={{flex:1,margin:10,padding:3,fontSize:15,color:"white"}}
                            onPress={()=>{
                            db.transaction(
                                tx=>{
                                    tx.executeSql('delete from astitva');
                                    navigation.navigate("menu");
                                    },
                                (e)=>{
                                    console.log(e);
                                    },
                                ()=>{
                                const max=1;
                                console.log("deleted");
                                const clr=async()=>{
                                    try{
                                        await AsyncStorage.setItem("max",JSON.stringify(max));
                                    }
                                    catch(e)
                                    {
                                        console.log("error updating max "+e);
                                    }
                                }
                                 clr();
                                    }
                            )
                            }}
                        >Clear All!</Text>
                        
                </View>
            
          )
            }
    }
    componentDidMount(){
        db=SQLite.openDatabase(this.props.navigation.getParam('user'));
        const {items}=this.state;
        db.transaction(
            tx=>{
                tx.executeSql(
                    'create table if not exists astitva(id integer primary key, date text,debit text,credit text,amount int,comment text,image text)'
                  );  
                tx.executeSql('select * from astitva',[],(_,rows)=>{
                    this.setState({items:[...items,...rows.rows._array]})
                })
            },
            (e)=>{
                console.log(e);
            },
            ()=>{
                console.log(JSON.stringify(this.state.items));
            }
        )
    }
    onLongPress=(id)=>{
        db.transaction(
            tx=>{
                tx.executeSql('delete from astitva where id=?',[parseInt(id)]);
                tx.executeSql('select * from astitva',[],(_,rows)=>{
                    console.log(rows.rows._array);
                })
            },
            (e)=>{console.log(e)},
            ()=>{
                const arr=this.state.items.filter(item=>(item.id!==id));
                this.setState({items:arr});
            }
        )
        
    }
    renderItem=({item:{id,date,debit,credit,amount,image,comment}})=>(
        <Card
        id={id}
        image={image}
        date={date}
        debit={debit}
        credit={credit}
        amount={amount}
        comment={comment}
        onLongPress={this.onLongPress}
        />
    );

    handleCancel=()=>{
        db.transaction(
            tx=>{
                tx.executeSql('select * from astitva',[],(_,rows)=>{
                    this.setState({items:[{id:0,date:"Date",debit:"Debit",credit:"Credit",amount:"Amount"},...rows.rows._array],search:""});
                })
                },
                (e)=>{
                    console.log(e);
                },
                )
            }
    

    handleSubmit=()=>{
        const {search}=this.state;
        if(typeof(this.state.search)==="string" && isNaN(parseInt(this.state.search)) && this.state.search!=="")
        {
            const modSearch="%"+search+"%";
            console.log(modSearch);
            db.transaction(
                tx=>{
                    tx.executeSql('select * from astitva where debit=? or credit=? or comment like ? or date=?',[search,search,modSearch,search],(_,rows)=>{
                        console.log(rows.rows.length);
                        if(rows.rows.length>0)
                        {this.setState({items:[{id:0,date:"Date",debit:"Debit",credit:"Credit",amount:"Amount"},...rows.rows._array]});}
                        else
                        {
                            Alert.alert('Not Found','Please try again',[
                                {text:"ok",onPress:()=>{this.setState({search:""})}},
                            ],{cancelable:false})
                        }
                    })
                },
                (e)=>{
                    console.log("error while searching"+e);
                },
                
            );
        }
        else if(typeof(search)==="string" && parseInt(search)>=0)
        {
            db.transaction(
                tx=>{
                    tx.executeSql('select * from astitva where amount=?',[parseInt(search)],(_,rows)=>{
                        if(rows.rows.length>0)
                        {this.setState({items:[{id:0,date:"Date",debit:"Debit",credit:"Credit",amount:"Amount"},...rows.rows._array]});}
                        else
                        {
                            Alert.alert('Not Found','',[
                                {text:"ok",onPress:()=>{this.setState({search:""})}}
                            ],{cancelable:false})
                        }
                    })
                },
                (e)=>{
                    console.log("error while searching amount "+e);
                }
            )
        }
        else{
            db.transaction(
                tx=>{
                    tx.executeSql('select * from astitva',[],(_,rows)=>{
                        this.setState({items:[{id:0,date:"Date",debit:"Debit",credit:"Credit",amount:"Amount"},...rows.rows._array]});
                    })
                },
                (e)=>{
                    console.log("error while searching amount "+e);
                }
            )
        }
    }
    render(){
        return(
            <View>
                <View style={{flexDirection:"row",justifyContent:"center"}}>
                    <View style={{flex:1}}></View>
                    <TextInput
                        style={{flex:2,textAlign:"center"}}
                        placeholder={this.state.place}
                        value={this.state.search}
                        onChangeText={(text)=>{this.setState({search:text})}}
                        onSubmitEditing={this.handleSubmit}
                        onBlur={this.handleSubmit}
                    />
                    <View style={{flex:1,justifyContent:"center"}}><Text onPress={this.handleCancel} style={{alignSelf:"flex-end",marginRight:10}}>X</Text></View>
                    
                </View>
                <View>
                    <FlatList
                        data={this.state.items}
                        renderItem={this.renderItem}
                        keyExtractor={keyExtractor}
                        showsVerticalScrollIndicator={true}                    />
                </View>
            </View>
        )
    }
}