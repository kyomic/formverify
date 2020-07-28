import React, { Component } from 'react';
import {KFile} from './KFile'
import {KImage} from './KImage'
import FileUploader from 'fileupload-lite';
export default class KImageUpload extends KFile {
	constructor( props ){
		super( props )
    this.state = Object.assign(this.state,{
      initColumnWidth:0
    })
	}

  static defaultProps={
    ...KFile.defaultProps,
    autoupload:true,
    cols:3,//每行显示多少个图片块（多文件上传时有效）
    ratio:1
  }

  componentDidMount(){
    super.componentDidMount();    
    let root = this.ref.current;
    let col = root.querySelector(".col");
    if( col ){
      let initColumnWidth = col.clientWidth;
      let calcWidth = Math.floor( root.offsetWidth * this.props.cols /12 );
      initColumnWidth = Math.min( initColumnWidth, calcWidth );
      this.setState({
        initColumnWidth:initColumnWidth
      })
    }
  }

	render() {
    const children = this.props.children
    let { autoupload, multiple } = this.props;
    let uploadCls = 'file file-image';
    let layoutCls = 'col col-' + this.props.cols;
    let colstyle = {}
    if( this.state.initColumnWidth ){
      colstyle.width = this.state.initColumnWidth;
      if( !multiple ){
        //10px padding
        colstyle.width -=10;
      }
      colstyle.height = colstyle.width * this.props.ratio;
    }
    if( multiple ){
      uploadCls += ' file-image-mutiple';
    }
    if( !this.value ){
    	uploadCls += ' file-image-empty'
    }
    let { filenames } = this.state;
    let filename = '';
    let wrapperHeight = colstyle.height;
    if( multiple ){
      wrapperHeight = 'auto'
    }
    if( filenames.length ){
      //上传完后的文件名
      filename = filenames[filenames.length-1]
    }else{
      if( this.state.streams && this.state.streams.length ){
        filename = this.state.streams[ this.state.streams.length-1].name;
      }
    }
    let per = 0;
    if( this.state.loaded && this.state.total ){
      per = parseInt(100*this.state.loaded / this.state.total);
    }

    let uploadEnabled = true;
    if( !autoupload && !filename){
      uploadEnabled = false;
    }

    let url = this.value;
    console.log('value',url)

    
    let single = ()=>{
      return (
        <div className={' file-view ' + layoutCls } style={colstyle}>
          <div className="file-info">
            <KImage src={url}></KImage>
            {
              url?'':(
              [
                <div key={'1'} className="file-info-progress" style={{width:per+"%"}}></div>,
                <div key={'2'} className="file-info-name"><span>{filename}</span></div>
              ])
            }
          </div>
          <div className="file-upload" style={colstyle} onClick={this.onUpload.bind(this)}>
            <div className="view">
              {url?<div className="reload-tip">重新上传</div>:''}
            </div>
            
          </div>
        </div>
      )
    }
    let multiply = ()=>{
      let files = this.state.streams||[];
      let viewdata = files.map( res =>{
        let pro = this.state.progress[ res.id ];
        let loaded = 0, total = 1;
        if( pro ){
          loaded = pro.loaded,total = pro.total
        }
        return {
          name: res.name,target:res, loaded, total
        }
      })
      let filesview = ()=>{
        return viewdata.map( (item,i) =>{
          let per = parseInt(100*item.loaded / item.total);
          let name = this.state.filenames[i];
          return (
            <div className={ layoutCls } style={colstyle} >
              <div key={i} className='file-info'>          
                <KImage src={name}></KImage>
                {
                  url?'':(
                  [
                    <div key={'1'} className="file-info-progress" style={{width:per+"%"}}></div>,
                    <div key={'2'} className="file-info-name"><span>{filename}</span></div>
                  ])
                }
                <div className="file-delete" onClick={this.onRemoveFile.bind(this,item.target)} ></div>
              </div>
            </div>
          )
        })
      }
      return (
        <div className="file-viewlist">
          <div className="file-view">
            {filesview()}
            <div className={layoutCls + " file-upload"} style={colstyle} onClick={this.onUpload.bind(this)}>
              <div className="view"></div>
            </div>
          </div>
          
        </div>
      )
    }
    return (
      <div className={this.getClassName()} ref={this.ref}>
        <div className={uploadCls} style={{height:wrapperHeight}}>
          <div className={multiple?"file-image-wrapper file-image-wrapper-multiple":'file-image-wrapper'}>
            <input disabled={this.props.disabled} type="file" style={colstyle} accept={this.props.accept||''} multiple={multiple?'multiple':''} onChange={this.onFileChange.bind(this)} ></input>
            {multiple ? multiply() : single()}
          </div>
        </div>        
      </div>
    );
  }
}