import React, { Component } from 'react';
import {KFormElement} from './KFormElement'
import {domquery as query} from '@/lib/utils/domquery.js'

export default class KImage extends KFormElement {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
    this.state = Object.assign(this.state,{
      src:'',
      mode:'fill',
    })
    this.image = null;
    this.viewWidth = 0;
    this.viewHeight = 0;
  }  
  static defaultProps={
    ...KFormElement.defaultProps, mode:'fill'
  }
  onClick(e){
    if( this.props.onClick ){
      this.props.onClick(e);
    }
  }

  reset(){
    this.state.naturalWidth = this.state.naturalHeight = 0;
  }

  layout(){
    if( !this.state.src ) return;
    if( !this.state.naturalWidth ){
      if( this.image ){
        let width = 0,height=0;
        if( this.image.naturalWidth ){
          width = this.image.naturalWidth;
          height = this.image.naturalHeight;
        }else{
          if( this.image.width ){
            width = this.image.width;
            height = this.image.height;
          }
        }
        this.state.naturalWidth = width;
        this.state.naturalHeight = height;
        this.setState({
          naturalWidth:width,
          naturalHeight:height
        })
      }
    }
    if( !this.viewWidth ){
      this.viewWidth = this.state.naturalWidth;
    }
    if( !this.viewHeight ){
      this.viewHeight = this.state.naturalHeight;
    }

    console.log("imgViewWidth-----------",this.viewWidth, this.viewHeight)
    let ratioView = this.viewWidth / this.viewHeight;
    let ratioNatural = this.state.naturalWidth / this.state.naturalHeight;
    let cropped_width = 0, cropped_height = 0;
    let mode = this.props.mode;
    if( ratioNatural >ratioView ){
      if( mode == 'fill' ){
        cropped_width = this.viewWidth;
        cropped_height = this.viewWidth / ratioNatural;
      }else{
        cropped_height = this.viewHeight;
        cropped_width = this.viewHeight * ratioNatural;
      }
    }else if( ratioNatural < ratioView ){
      if( mode == 'fill'){
        cropped_height = this.viewHeight;
        cropped_width = this.viewHeight * ratioNatural;
      }else{
        cropped_width = this.viewWidth;
        cropped_height = this.viewWidth / ratioNatural;
      }
    }else{
      cropped_width = this.viewWidth;
      cropped_height = this.viewHeight;
    }
    this.setState({
      imageWidth: cropped_width, imageHeight: cropped_height
    })
    this.opacity = 1;
    console.log("viewWidth",this.viewWidth,'viewHeight',this.viewHeight, 'cropped_width', cropped_width, 'cropped_height', cropped_height)

  }

  onImageEvent(e){
    console.log('imge event',e)
    let img = e.target;
    console.log('img',img.width, img.height, img.naturalWidth)
    this.layout();
  }

  componentWillReceiveProps( nextProps ){
    console.log("this.props", this.props, nextProps)
    if( nextProps.src ){
      this.reset();
      this.setState({
        src:nextProps.src
      })
    }
    if( nextProps.style ){
      console.log("style", nextProps.style)
      let root = this.ref.current;
      if( root ){
        let h = query.pixelVal( query( root ).css('height'));
        console.log(this.id, root, "~~~~viewWidth(props)========",h, root.offsetHeight)
      }
    
    }
  }
  componentDidMount(){
    //重载，form不再接收onFormElementMounted事件
    //return
    if( this.props.src ){
      this.setState({
        src:this.props.src
      })
    }    
    this.opacity = 0;    
  }
  componentDidUpdate(prevProps,prevState){
    this.image = this.ref.current.querySelector('img');
    let root = this.ref.current;
    let w = query.pixelVal( query( root ).css('width'));
    let h = query.pixelVal( query( root ).css('height'));
    this.viewWidth = w;
    this.viewHeight = h;
  }

  render() {
    let { src, imageWidth, imageHeight  } = this.state;
    const children = this.props.children
    let imageStyle = {};
    
    if( imageWidth && imageHeight ){
      imageStyle.width = imageWidth, imageStyle.height = imageHeight
    }
    return (
      <div ref={this.ref} className="k-image" style={this.props.style}>
        <img style={ imageStyle } src={src} onLoad={this.onImageEvent.bind(this)} onError={this.onImageEvent.bind(this)}  />
      </div>
    );
  }
}