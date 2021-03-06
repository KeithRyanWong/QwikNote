// Component indicates swipe gesture has been initiated and in which direction
// Properties:
//    diameter: determines cancel area and size of indicator
//    actions: will be executed at different stages of gesture
//      1) onStart -> when swipe is initiated, passes in location of gesture
//      2) onSwipe -> when swipe is in motion, passes in start and current position of touch
//      3) onLeftSwipe -> when swipe ends in left direction
//      4) onRightSwipe -> when swipe ends in right direction
//      5) onCancel -> when swipe is cancelled by going back to start of gesture



import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Slider
} from 'react-native';


export default class SideSwiper extends Component {
  constructor(props) {
    super(props);

    let defaultAction = () => {};

    this.state = {
      touchStart: {},
      directionDisplay: "none",
      x: -100,
      y: -100,
      hideTouch: props.hide || false, 
      diameter: props.diameter || 25,
      onLeftSwipe: props.onLeftSwipe || defaultAction,
      onRightSwipe: props.onRightSwipe || defaultAction,
      onCancel: props.onCancel || defaultAction,
      onSwipe: props.onSwipe || defaultAction,
      onStart: props.onStart || defaultAction,
    };

    this.detectStart = this.detectStart.bind(this);
    // this.handleTouchError = this.handleTouchError.bind(this);
    this.handleSwipeMove = this.handleSwipeMove.bind(this);
    this.handleSwipeFinish = this.handleSwipeFinish.bind(this);
  }
  
  render() {
    const { directionDisplay, touchStart, diameter } = this.state;
    const radius = diameter / 2;

    return (
      <View 
        style={styles.container}
        onStartShouldSetResponder={evt => true}
        onMoveShouldSetResponder={evt => true}
        onResponderGrant={this.detectStart}
        onResponderMove={this.handleSwipeMove}
        onResponderRelease={this.handleSwipeFinish}>
        <View 
          style={{
            position: "absolute",
            display: directionDisplay,
            width: diameter,
            height: diameter,
            left: touchStart.x - radius,
            top: touchStart.y - radius,
            borderRadius: radius,
            borderWidth: 1,
            borderColor: "black",
          }}>
        </View>
      </View>
    );
  }


  detectStart({ nativeEvent }) {
    const x = nativeEvent.pageX;
    const y = nativeEvent.pageY;
    const location = { 
      x,
      y,
    };
    const directionDisplay = this.state.hideTouch ? "none" : "flex";

    this.state.onStart(location);
    

    this.setState({
      touchStart: location,
      directionDisplay,
      x,
      y,
    });
  }

  handleSwipeMove({ nativeEvent }) {
    const x = nativeEvent.pageX;
    const y = nativeEvent.pageY;

    this.state.onSwipe(this.state.touchStart, { x, y });

    this.setState({
      x,
      y
    });
  }

  handleSwipeFinish({ nativeEvent }) {
    const x = nativeEvent.pageX;
    const y = nativeEvent.pageY;
    let touchResponse;
    let { touchStart, onLeftSwipe, onRightSwipe, onCancel } = this.state;

    if(x < touchStart.x - 25) {
      onLeftSwipe();
    } else if (x > touchStart.x + 25) {
      onRightSwipe();
    } else {
      onCancel();
    }

    this.setState({
      directionDisplay: "none",
    });
  } 
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: "transparent",
    position: "absolute",
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
    // borderWidth: 1,
    // borderColor: "black",
    height: "100%",
    width: "100%",
    zIndex: 1,
  },
});