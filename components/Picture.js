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

import _ from 'lodash'

import randomColor from 'randomcolor'

export default class Picture extends Component {
  constructor(props) {
    super(props)
    let colors = []
    if (props.data.type == 'faces')
      colors = randomColor({count: props.data.data.images[0].faces.length})
    this.state = {
      image: props.image,
      data: props.data,
      colors: colors
    }
  }

  render() {
    let image = this.state.image.sizes[3]
    let trueImage = _.last(this.state.image.sizes)
    return (
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.welcome}>
            Вот что нам удалось найти
          </Text>
          <View style={{position: 'relative', width: image.width, height: image.height}}>
            <Image
              source={{uri: image.src}}
              style={{width: image.width, height: image.height, position: 'absolute'}}
            />
            <Borders data={this.state.data} colors={this.state.colors} />
          </View>
          <Description data={this.state.data} colors={this.state.colors} />
          <Text style={styles.instructions} onPress={() => this.props.backToMain()}>
           Начать сначала
          </Text>
        </View>
      </ScrollView>
    )
  }
}

class Borders extends Component {
  constructor(props) {
    super(props)
  }

  render () {
    let type = this.props.data.type
    let data = this.props.data.data
    let colors = this.props.colors
    switch (type) {
      case 'faces':
        return (
          <View>
            {data.images[0].faces.map((face, i) => {
              let color = colors[i]
              let style = face.face_location
              style.position = 'absolute'
              style.borderColor = color
              style.borderWidth = 1
              style.borderStyle = 'solid'
              return (
                <View style={style} key={i}>
                </View>
              )
            })}
          </View>
        )
      default:
        return null
    }
  }
}

class Description extends Component {
  constructor(props) {
    super(props)
  }

  render () {
    let type = this.props.data.type
    let data = this.props.data.data
    let colors = this.props.colors
    switch (type) {
      case 'faces':
        return (
          <View>
            {data.images[0].faces.map((face, i) => {
              let color = colors[i]
              return (
                <View key={i} style={{ borderWidth: 1, borderColor: color, borderStyle: 'solid', margin: 10}}>
                  <Text>
                    Возраст: {face.age.min != undefined ? (face.age.min + ' - ') : ''}{face.age.max}
                  </Text>
                  <Text>
                    Пол: {face.gender.gender == 'MALE' ? 'Мужской' : 'Женский'}
                  </Text>
                </View>
              )
            })}
          </View>
        )
      case 'classes':
        return (
          <Text>
            Нам не удалось обнаружить лица на Вашей фотографии.
            Возможно, на фотографии есть {data.text}?
          </Text>
        )
      default: return null
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    textDecorationLine: 'underline'
  },
});
