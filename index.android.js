/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  View,
  Alert
} from 'react-native';

import _ from 'lodash'

import Main from './components/Main'
import Picture from './components/Picture'

export default class vkImageRec extends Component {
  constructor(props) {
    super(props)
    this.state = {
      step: 1
    }
  }

  pickImage(image) {
    let params = {
      method: 'POST',
      headers: {"Content-Type": "application/json",},
      body: JSON.stringify({src: image.sizes[3].src})
    }
    // request to localhost
    fetch('http://10.0.2.2/image', params)
      .then(res => res.json())
      .then(data => this.setState({step: 2, image: image, imageData: data}))
      .catch(err => Alert.alert('error', JSON.stringify(err, null, 2)))
  }

  backToMain() {
    this.setState({step: 1, image: null, imageData: null})
  }

  render() {
    let pickImage = this.pickImage.bind(this)
    let backToMain = this.backToMain.bind(this)
    switch (this.state.step) {
      case 1:
        return (
          <Main pickImage={pickImage} />
        )
      case 2:
        return (
          <Picture image={this.state.image} data={this.state.imageData} backToMain={backToMain} />
        )
    }
  }
}

AppRegistry.registerComponent('vkImageRec', () => vkImageRec);
