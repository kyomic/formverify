import React, { Component } from 'react';
import {KFormElement} from './KFormElement'
export default class KRadio extends KFormElement {
  constructor( props ){
    super(props);
    this.state = {
      isChecked:false
    }
  }
  onChangeHandler(e){
    let checked = this.state.isChecked;
    checked = !checked;
    this.setState({
      isChecked:checked
    }, ()=>{
      this.props.onFormElementChange && this.props.onFormElementChange( this )
    })
  }
  /** 
   * 非选中状态的缓存值
   */
  get cacheValue(){
    return this.props.value;
  }

  set checked( arg ){
    if( this.ref.current ){
      this.ref.current.checked = arg;
    }
    this.setState({
      isChecked:arg
    })
  }

  get checked(){
    return this.state.isChecked
  }

  get value(){
    if( this.checked && this.ref.current ){
      return this.props.value || this.ref.current.value;
    }
    return '';
  }

  componentDidMount(){
    let checked = this.props.checked || false;  
    this.checked = checked;      
    super.componentDidMount();
  }
  render() {
    let radioCls = "radio";
    if( this.state.isChecked ){
      radioCls += ' radio-checked'
    }
    return (
      //在按纽组中
      this.props.groupId ? (
        <label className={radioCls} >
          {
            React.Children.map(this.props.children, function (child) {
              return child;
            })
          }
          <input type='radio' name={ this.props.groupId } ref={ this.ref } onChange={ this.onChangeHandler.bind(this) } onBlur={ this.onComponentBlur.bind(this) } />
          <i />
        </label>
      ):(
      //不在按纽组中
        <div className={ this.getClassName() } ref={ this.ref }>
          <label className= {radioCls} >
            {
              React.Children.map(this.props.children, function (child) {
                return child;
              })
            }
            <input type='radio'  onChange={ this.onChangeHandler.bind(this) } onBlur={ this.onComponentBlur.bind(this) } />
            <i />
          </label>
        </div>
      )
    )
  }
}