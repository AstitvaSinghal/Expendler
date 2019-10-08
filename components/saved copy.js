<View style={[{flex:1.25,flexDirection:"row"},styles.views]}>
              <Text style={[styles.text,{marginRight:20,width:100}]}>To:</Text>
            <TextInput 
          value={this.state.to}
          style={styles.input} 
          onChangeText={this.handleTo}
          />
          </View>
          
          
            <View style={[{flex:1.25,flexDirection:"row"},styles.views]}>
              <Text style={[styles.text,{marginRight:20,width:100}]}>From:</Text>
            <TextInput 
          value={this.state.from}
          style={styles.input} 
          onChangeText={this.handleFrom}
          />
            </View>
            