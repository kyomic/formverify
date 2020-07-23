import React, { Component } from 'react';
import {KFormElement} from './KFormElement'
export default class KButton extends KFormElement {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
  }  
  onClick(e){
    if( this.props.onClick ){
      this.props.onClick(e);
    }
  }
  componentDidMount(){
    //重载，form不再接收onFormElementMounted事件
    //return
  }
  render() {
    const children = this.props.children
    return (
      <button ref={this.ref} className={this.getClassName()} onClick={ this.onClick.bind(this )}>
        {
          React.Children.map(this.props.children, function (child) {
            return child;
          })
        }
      </button>
    );
  }
}