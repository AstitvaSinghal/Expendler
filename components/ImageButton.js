import React from 'react';
import {TouchableOpacity,Image} from 'react-native';

export default class ImageButton extends React.Component{

render(){
    const {style,path,onPress}=this.props;
    
    return(
        <TouchableOpacity onPress={onPress}>
            <Image style={style} source={path}/>
        </TouchableOpacity>
    )
}
}