import React, { Component } from 'react'
import { Animated, Keyboard } from 'react-native'

export default class KeyboardAvoidingView extends Component {
  constructor(props) {
    super(props)

    this.keyboardHeight = new Animated.Value(0)
  }

  componentWillMount() {
    this.keyboardWillShowSub = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow)
    this.keyboardWillHideSub = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide)
  }

  componentWillUnmount() {
    this.keyboardWillShowSub.remove()
    this.keyboardWillHideSub.remove()
  }

  keyboardWillShow = (event) => {
    Animated.parallel([
      Animated.timing(this.keyboardHeight, {
        duration: event.duration,
        toValue: event.endCoordinates.height,
      }),
    ]).start()
  };

  keyboardWillHide = (event) => {
    Animated.parallel([
      Animated.timing(this.keyboardHeight, {
        duration: event.duration,
        toValue: 0,
      }),
    ]).start()
  };

  render() {
    const { style, children } = this.props

    return (
      <Animated.View style={[style, { paddingBottom: this.keyboardHeight }]}>
        {children}
      </Animated.View>
    )
  }
}
