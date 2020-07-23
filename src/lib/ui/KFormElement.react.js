import React, { Component } from 'react';
import {domquery as query} from '@/lib/utils/domquery.js'
export default class KFormElement extends Component {  
  constructor(props) {
    super(props);
    this.id = "kui" + (~~ (Math.random() * 1000));
    this.state = {
      checked:false,
      value: this.props.value, 
      rule: this.props['data-rule'],
      error: this.props['data-error'],
      //是否表单验证正确
      valid: true,
    };
    this.ref = React.createRef();
  }

  static defaultProps={
    defaultclass:'form-control',
    defaultInvalidClass:'form-control-invalid'
  }

  set opacity( alpha ){
    if( this.ref.current ){
      query( this.ref.current ).css("opacity", alpha);
    }
  }

  get value(){
    return this.state.value ||'';
  }

  /** 返回样式名 */
  getClassName(){
    let validCls = (typeof this.state.valid=='boolean' && !this.state.valid) ? this.props.defaultInvalidClass :'';
    return [ this.props.defaultclass, validCls, this.props.className || '',this.id ].join(" ")
  }

  errorInfo( msg ){
    let dom = this.ref.current;
    if( !dom )return;
    let wrapper = dom.parentNode;
    let err = wrapper.querySelector('.err-tip');
    if( !err ){
      err = document.createElement('span');
      err.className = 'err-tip';
      wrapper.appendChild( err )
    }
    err.innerHTML = msg;
    this.setState({
      valid:false
    })
  }

  errorClear(){
    let dom = this.ref.current;
    if( !dom )return;
    let wrapper = dom.parentNode;
    let err = wrapper.querySelector('.err-tip');
    if( err ){
      err.innerHTML = '';
    }
    this.setState({
      valid:true
    })
  }

  //componentWillMount(){}
  componentDidMount(){
    if( this.props.onFormElementMounted ){
      this.props.onFormElementMounted( this )
    }
  }

  onComponentBlur(){
   if( this.props.onFormElementBlur ){
      this.props.onFormElementBlur( this )
    }
  } 
  onComponentChange(){
    if( this.props.onFormElementChange ){
      this.props.onFormElementChange( this )
    }
  }
  //componentWillUpdate(nextProps, nextState){}
  componentDidUpdate(prevProps, prevState){}
  /*
  componentWillReceiveProps( nextProps ){
    console.log("nextProps",nextProps)
    if(nextProps.value !== this.props.value){
      this.setState({value:nextProps.value})
    }
  }
  */

  /*
  shouldComponentUpdate(){
    console.log('shouldComponentUpdate')
  }
  */
}