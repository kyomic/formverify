import React, { Component } from 'react';
import {KFormElement} from './index.js'
export default class KRadioGroup extends KFormElement {  
  constructor( props ){
    super( props );
    this.radios = [];
  }
  onFormElementMounted( element ){
    this.radios.push( element );
  }
  onRadioChange( radio ){
    if( this.props.disabled ){
      return;
    }
    this.radios.map(r=> r.checked = false );
    radio.checked = true;
    //触发change
    this.onComponentChange();
  }
  onRadioBlur( radio ){
    this.onComponentBlur();
  }


  get value(){
    let checkedRadio = this.radios.filter( r=> r.checked );
    if( checkedRadio && checkedRadio.length ){
      return checkedRadio[checkedRadio.length-1].value;
    }
    return '';
  }
  set value( val ){
    if( val ){
      this.radios.map( r =>{
        if( r.cacheValue == val ){
          r.checked = true;
        }else{
          r.checked = false;
        }
      })
    }
  }
  componentDidMount(){
    this.value = this.props.value||'',
    super.componentDidMount();
  }
  render() {
    return (
      <div className={ this.getClassName() } ref={this.ref}>
        {
          React.Children.map(this.props.children, child=>{
            let ChildComponentWithRef = React.forwardRef( ( props, ref )=>{
              let newProps = {
                ...props, groupId: this.id,disabled:this.props.disabled,
                onFormElementMounted: this.onFormElementMounted.bind( this ),
                onFormElementChange: this.onRadioChange.bind(this),
                onFormElementBlur: this.onRadioBlur.bind( this )
              };
              return React.cloneElement( child, {
                ...newProps, ref
              })
            })
            let newProps = {
              ...child.props, groupId: this.id,disabled:this.props.disabled,
              onFormElementMounted: this.onFormElementMounted.bind( this ),
              onFormElementChange: this.onRadioChange.bind(this),
              onFormElementBlur: this.onRadioBlur.bind( this )
            };
            console.log("######attrs", newProps)
            return React.cloneElement( child, {
              ...newProps
            })
            return <ChildComponentWithRef />;
          })
        }
      </div>
    )
  }
}