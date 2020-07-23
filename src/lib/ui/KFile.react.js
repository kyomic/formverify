import React, { Component } from 'react';
import {KFormElement} from './KFormElement'
import FileUploader from 'fileupload-lite';

export default class KFile extends KFormElement {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
    this.uploader = new FileUploader()
    this.state = Object.assign( this.state, {
      serverConfig:{
        type:"form"
      },
      files:[],
      streams:[],
      progress:{},
      loaded:0,
      total:0,
      filenames:[]
    })
    this.latestFile = null;
    this.uploader.on('load', this.onUploadEvent.bind( this ))
    this.uploader.on('progress', this.onUploadEvent.bind( this ))
    this.uploader.on('error', this.onUploadEvent.bind( this ))
    this.uploader.on('complete', this.onUploadEvent.bind( this ))
  }
  static defaultProps={
    ...KFormElement.defaultProps,
    defaultclass:'form-control',
    filetype:"file",
    maxCount:1,
    multiple:false,
  }
  onUpload(e){
    if( this.props.onClick ){
      this.props.onClick(e);
    }

    let {autoupload} = this.props;
    let filedom = this.ref.current.querySelector("input[type=file]")
    if( autoupload ){
      //event change upload
      filedom.click();
    }else{
      this.upload();
    }
  }
  onBrower(e){
    let filedom = this.ref.current.querySelector("input[type=file]")
    if( autoupload ){
      filedom.click();
    }
  }

  onFileChange(e){
    console.log(e.target.files);
    var self = this
    let files = Array.from(e.target.files);    
    //移除正在上传的文件
    if( !this.props.multiple ){
      console.log("latestFile", this.latestFile, files)
      if( this.latestFile && files[files.length-1].name == this.latestFile.name ){
        console.warn('same file')
        return;
      }
      this.removeAllFiles();
    }
    files = files.concat( this.state.files );
    this.setState({
      files: files,
      loaded:0,
      total:0,
      complete:false
    }, function(){
      if( this.state.auto ){
        this.upload();
      }
    });
    
  }
  onUploadEvent( e ){
    console.log('upload event:', e)
    let data = e.data;
    let streams = this.state.streams;
    switch( e.type ){
      case 'load':
        console.log('添加文件:',data[0].file.name)
        if( data[0] ){
          this.latestFile = data[0];
        }
        for( let i=0;i<data.length;i++){
          streams.push( data[i] )
        }
        this.setState({
          streams: [...streams]
        })
        break;
      case 'progress':
        if( this.props.multiple ){
          let id = data.taskid;
          let progress = this.state.progress;
          let loaded = data.loaded, total = data.total;
          if( !progress[id] ){
            progress[id] = {}
          }
          progress[id] = { id,loaded,total }
          this.setState({
            progress:{...this.state.progress}
          });
        }else{
          this.setState({
            loaded:data.loaded,total:data.total
          })
        }
        
        break;
      case 'complete':
        let response = data.detail.response;
        let filenames = this.state.filenames;
        streams.map( file =>{
          if( file.id == data.taskid ){
            filenames.push('http://static.funshion.com/open/static/img/logo.gif')
          }
        })
        this.setState({
          complete:true,
          filenames
        }, function(){
          this.props.onFormElementChange && this.props.onFormElementChange( this )
        })

        
        break;
      case 'error':
        if( e.code && e.code > 5000 ){
          console.log('warn:', e.message)
        }else{
          this.errorInfo("上传出错")
        }
        break;
    }
  }
  onRemoveFile( file ){
    let fileid = file.id;
    let idx = this.state.streams.findIndex( f=>{
      return f.id == file.id;
    } );
    if( idx >-1){
      this.state.progress[fileid] = null;
      this.state.files.splice( idx, 1);
      this.state.streams.splice( idx, 1);
      this.state.filenames.splice( idx, 1 );
      this.setState({
        files:this.state.files.concat(),
        streams:this.state.streams.concat(),
        filenames:this.state.filenames.concat(),
        progress:{...this.state.progress}
      })
      this.uploader.remove( file.id );
    }

    this.props.onFormElementChange && this.props.onFormElementChange( this )
  }
  
  componentDidMount(){
    //重载，form不再接收onFormElementMounted事件
    //return
    if( this.props.server ){
      this.setState({
        serverConfig:{
          ...this.state.serverConfig,url:this.props.server
        }
      })
    }
    if( this.props.autoupload ){
      this.setState({
        auto:this.props.autoupload
      })
    }
    super.componentDidMount();
  }

  removeAllFiles(){
    let streams = this.state.streams;
    streams.map( res =>{
      this.onRemoveFile( res );
    })
    this.setState({
      filenames:[],
      streams:[],
      files:[]
    })
    this.state.filenames = [];
    this.state.streams = [];
    this.state.files = [];
  }

  upload(){
    this.uploader.option = {
      worker:0,
      blockSize:100*1024,
      taskCount:10,
      //一个任务被切分的线程数 
      taskThreadCount:10,
      serverConfig:this.state.serverConfig
    }    
    let newfiles = this.state.files.filter( file=> !file.running ) || [];
    for(let i=0;i<newfiles.length;i++){
      this.uploader.addFile( newfiles[i] )
    }
    newfiles.map(file=> file.running = true );
    this.uploader.upload();
  }

 

  get value(){
    let {files, filenames} = this.state;
    if( filenames ){      
      return filenames.join(',')
    }
    return '';
  }

  render() {
    const children = this.props.children
    let { autoupload, multiple } = this.props;
    let uploadCls = autoupload ? 'file file-auto':'file file-user';
    if( multiple ){
      uploadCls += ' file-multiple';
    }
    let { filenames } = this.state;
    let filename = '';
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

    console.log("render............", this.value, this.state)
    let single = ()=>{
      return (
        <div className="file-view">
          <div className="file-info">              
            <div className="file-info-progress" style={{width:per+"%"}}></div>
            <div className="file-info-name"><span>{filename}</span></div>
          </div>
          {
            autoupload?<input type="button" className="file-browser" value={this.state.complete?'重新上传':'上传'} onClick={this.onUpload.bind(this)}></input>
            :<input type="button" className="file-browser" value='浏览' onClick={this.onBrower.bind(this)}></input>
          }
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
          return (
            <div key={i} className="file-info">              
              <div className="file-info-progress" style={{width:per+"%"}}></div>
              <div className="file-info-name"><span>{item.name}</span></div>
              <input className="file-delete" type='button' value="删除" onClick={this.onRemoveFile.bind(this,item.target)} />
            </div>
          )
        })
      }
      return (
        <div className="file-viewlist">
          <div className="file-view">
            {filesview()}
          </div>
          <input type="button" className='file-browser' disabled={!uploadEnabled} value={this.value?'继续添加':'上传'} onClick={this.onUpload.bind(this)}></input>
        </div>
      )
    }
    return (
      <div className={this.getClassName()} ref={this.ref}>
        <div className={uploadCls}>
          <div className={multiple?"file-wrapper-multiple":'file-wrapper'}>
            <input type="file" accept={this.props.accept||''} multiple={multiple?'multiple':''} onChange={this.onFileChange.bind(this)} ></input>
            {multiple ? multiply() : single()}
          </div>
          {
            (!autoupload && !multiple)?<input type="button" className='file-upload' disabled={!uploadEnabled} value={this.state.complete?'重新上传':'上传'} onClick={this.onUpload.bind(this)}></input>:''
                
          }
        </div>        
      </div>
    );
  }
}