import React, { Component } from 'react';
import {KFormElement} from './index.js'
export default class KInput extends KFormElement {  
  constructor(props) {
    super(props);    
  }  
  onTextInput(e){
    let input = this.ref.current;
    this.setState({
      value: this.ref.current? this.ref.current.value:""
    })
  }

  onTextBlur( e ){
    this.onComponentBlur();
  }
  
  render() {
    return <input type='text' disabled={this.props.disabled} className={ this.getClassName() } ref={ this.ref } onChange={this.onTextInput.bind(this)} onBlur={this.onTextBlur.bind(this)} />;
  }
}