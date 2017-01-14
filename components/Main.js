import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Alert,
  Image,
  ScrollView,
  TouchableHighlight
} from 'react-native';

import url from 'url-parse'

const vkApiV = '5.60'

export default class Main extends Component {
  constructor(props) {
    super(props)
    this.state = {text: '', images: []}
  }

  onPressHandler() {
    let text = this.state.text
    if (!text.startsWith('http')) text = 'http://' + text
    let screenName = url(text, true).pathname.replace('/','')
    fetch(`https://api.vk.com/method/utils.resolveScreenName?screen_name=${screenName}&v=${vkApiV}`)
    .then(res => res.json())
    .then(data => {
      fetch(`https://api.vk.com/method/photos.get?owner_id=${data.response.object_id}&album_id=profile&photo_sizes=1&rev=1&v=${vkApiV}`)
        .then(res => res.json())
        .then(photos => {
          this.setState({images: photos.response.items})
        })
    })
  }

  imagePressHandler(image) {
    this.props.pickImage(image)
  }

  render() {
    let press = this.onPressHandler.bind(this)
    let imagePress = this.imagePressHandler.bind(this)
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Привет!
        </Text>
        <Text style={styles.instructions}>
          Введи ссылку на страницу в vk
        </Text>
        <TextInput
          style={{height: 40, margin: 10, alignSelf: 'stretch'}}
          value={this.state.text}
          onChangeText={(text) => this.setState({text})}
        />
        <Button onPress={press} title="найти!" />

        <ScrollView style={{alignSelf: 'stretch', marginTop: 20}} >
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around', alignItems: "flex-start", flexWrap: 'wrap'}}>
            {this.state.images.map((image, i) => {
                let newImage = image.sizes[0]
                return (
                  <TouchableHighlight style={{marginBottom: 5}} key={i} onPress={() => imagePress(image)} >
                    <Image
                      style={{width: newImage.width, height: newImage.height}}
                      source={{uri: newImage.src}}
                    />
                  </TouchableHighlight>
                )
              })
            }
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
