import React, { Component } from 'react';
import {KFormElement} from './index.js'
export default class KCheckBoxGroup extends KFormElement {  
  constructor( props ){
    super( props );
    this.checkboxs = [];
  }
  onFormElementMounted( element ){
    this.checkboxs.push( element );
  }
  onCheckBoxChange( checkbox ){  
    if( this.props.disabled ){
      return;
    }
    //触发change
    this.onComponentChange();
  }
  onCheckBoxBlur( checkbox ){
    this.onComponentBlur();
  }


  get value(){
    let vals = [];
    this.checkboxs.map( r => {
      if( typeof r.value!='undefined'){
        vals.push( r.value )
      }
    });
    return vals.join(',');
  }

  set value( val ){
    if( val ){
      let vals = val.split(',')
      this.checkboxs.map( r =>{
        if( vals.indexOf(r.cacheValue)!=-1 ){
          r.checked = true;
        }else{
          r.checked = false;
        }
      })
    }
  }
  componentDidMount(){
    this.value = this.props.value||'' 
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
                onFormElementChange: this.onCheckBoxChange.bind(this),
                onFormElementBlur: this.onCheckBoxBlur.bind( this )
              };
              return React.cloneElement( child, {
                ...newProps, ref
              })
            })
            let newProps = {
                ...child.props, groupId: this.id,disabled:this.props.disabled,
                onFormElementMounted: this.onFormElementMounted.bind( this ),
                onFormElementChange: this.onCheckBoxChange.bind(this),
                onFormElementBlur: this.onCheckBoxBlur.bind( this )
              };
            return React.cloneElement( child, {
                ...newProps
              })
            //return <ChildComponentWithRef />;
          })
        }
      </div>
    )
  }
}