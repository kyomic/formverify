import React, { Component } from 'react';

import { KForm, KInput, KButton, KRadioGroup, KRadio, KCheckBoxGroup, KCheckBox, KFile, KImageUpload, KImage } from '@/lib/ui/index.js';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      elements:[]
    };
  }
  verifyFunc( val, component ){
    if( val ) return true;
    return {result:false}
  }

  onSubmitHandler(){
    let form = this.refs.form;
    let res = form.verify();
    if( !res ){
      return;
    }
  }
  onParamsHandler(){
    console.log("参数", this.refs.form.params())
  }
  addElement( ele ){
    console.log('render', ele)
  }
  componentDidUpdate(){
    console.log("eles", this.state.elements)
  }
  render(){
    return (
      <KForm ref="form">
        <div className="form-group"></div>
        <div className="form-group">
          <label className="form-label">名称：</label>
          <KInput name="input1" className="abc" rule=".+###^[a-zA-Z]+$" error="必填###只能填英文"></KInput>
        </div>
        <div className="form-group">
          <label className="form-label">名称：</label>
          <KInput name="input2" className="abc" rule={this.verifyFunc.bind(this)} error="必填"></KInput>
        </div>
        <div className="form-group">
          <label className="form-label">单选框组：</label>
          <KRadioGroup name="raidogroup" value='2' rule=".+" error="必填">
            <KRadio value="1">选项A</KRadio>
            <KRadio value="2">选项A</KRadio>
          </KRadioGroup>
        </div>
        <div className="form-group">
          <label className="form-label">单选组：</label>
          <KRadio name="radio" value="1" rule=".+" error="必填">选项A</KRadio>
        </div>
        <div className="form-group">
          <label className="form-label">单选框组：</label>
          <KCheckBoxGroup name="checkboxgroup" rule=".+" error="必填">
            <KCheckBox value="1">选项A</KCheckBox>
            <KCheckBox value="2">选项A</KCheckBox>
          </KCheckBoxGroup>
        </div>
        <div className="form-group">
          <label className="form-label">单选组：</label>
          <KCheckBox name="checkbox" value="1" rule=".+" error="必填">选项A</KCheckBox>
        </div>
        <div className="form-group">
          <KImage mode='fill' src="http://static.funshion.com/open/static/img/logo.gif" />
        </div>
        <div className="form-group">
          <KFile name="file" accept=".jpg,.mp4"
            rule=".+" error="必填"
           server="http://m2.fun.tv/file.php" autoupload={true} multiple={false}></KFile>
        </div>
        <div className="form-group">
          <KFile name="file-mutilple" accept=".jpg,.mp4"
            rule=".+" error="必填"
           server="http://m2.fun.tv/file.php" autoupload={true} multiple={true}></KFile>
        </div>
        <div className="form-group">
          <KImageUpload name="file-image" accept=".jpg"
            rule=".+" error="必填"
           server="http://m2.fun.tv/file.php" multiple={false}></KImageUpload>
        </div>
        <div className="form-group">
          <KImageUpload name="file-image-mutilple" cols={2} accept=".jpg"
            rule=".+" error="必填"
           server="http://m2.fun.tv/file.php" multiple={true}></KImageUpload>
        </div>
        
        <div className="form-group">          
          <KButton className="test" onClick={this.onSubmitHandler.bind(this)}>提交</KButton>
          <KButton className="test" onClick={this.onParamsHandler.bind(this)}>表单参数</KButton>
        </div>
      </KForm>
    )
  }
}