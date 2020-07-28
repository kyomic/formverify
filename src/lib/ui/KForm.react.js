import React, { Component } from 'react';
import ReactDOM from 'react-dom'

import {KFormElement} from './KFormElement.js'
import {domquery as query} from '@/lib/utils/domquery.js'
import verify from '@/lib/utils/verify.js'
console.log('verify',verify)
let verify_api = verify;
export default class KForm extends Component {
  constructor(props) {
    super( props );
    // 组件所在的DOM父容器
    this.refs = [];
    // 组件实例
    this.components = [];
  }

  verify(){
    let result = null;
    for( let i=0;i<this.components.length;i++){
      if( this.components[i]){
        let { rule, error } = this.components[i].props;
        result =this.verifyElement( this.components[i] );
        if( !result || (typeof result=='object' && !result.result)){
          result = false;
          break;
        }
      }
    }
  }
  /**
   * @param {KFormElement} component 组件实例
   */
  verifyElement( component ){
    console.log('verify:', component)
    let {rule,error,disabled} = component.props;
    let value = component.value;
    if( disabled ){
      return true;
    }
    let res = verify_api.verify( component, { value, rule, error })
    if( !res || (typeof res=='object' && !res.result) ){
      component.errorInfo( res ? res.error: verify_api.option.error )
      return res;
    }else{
      component.errorClear();
    }
    return true;
  }

  params(){
    let param = {}
    this.components.map( ele =>{
      if( ele.props.name ){
        if( !ele.props.disabled ){
          //不可用的组件忽略
          param[ ele.props.name ] = ele.value;
        }        
      }
    })
    return param;
  }

  onFormElementMounted( element ){
    this.components.push( element )
    console.log("***formelement found", element)
  }

  onFormElementBlur( element ){
    this.verifyElement( element );
  }
  onFormElementChange( element ){
    this.verifyElement( element )
  }

  componentDidMount() {
    console.log("form mounted this.refs",this.refs, this.components)
  }

  
  render(){
    let deepClone = ( children )=>{
      if( Array.isArray( children ) ){
        return React.Children.map( children, child =>{
          return deepClone( child );
        })
      }else{
        //找到组件，就添加 FormElementMounted事件
        if( typeof children.type == 'function'){          
          let newProps = { 
            ...children.props,
            onFormElementMounted: this.onFormElementMounted.bind( this ),
            onFormElementBlur:this.onFormElementBlur.bind( this ),
            onFormElementChange:this.onFormElementChange.bind( this )
          }
          let clone = React.cloneElement( children, {
            ...newProps
          })
          return clone
        }else{
          let childs = children.props.children;
          
          if( Array.isArray( childs ) || typeof childs=='object'){
            childs = deepClone( childs );
          }
          return React.cloneElement( children, {
            ...children.props,
          }, childs)
        }
      }
    };
    let children = this.props.children;
    return (
      <div className="form">
      { deepClone( children ) }
      </div>
    )
  }
}