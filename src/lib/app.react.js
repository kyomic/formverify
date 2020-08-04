import React, { Component } from 'react';
import { render } from 'react-dom';
import verify from '@/lib/utils/verify.js'
import { 
  KForm, KInput, KButton, KRadioGroup, KRadio, KCheckBoxGroup, KCheckBox, KFile, KImageUpload, KImage ,
  KSwitch,KSelectOption,KSelect
} from '@/lib/index.js';
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
    let disabled = false;
    let readonly = true;
    let uploadUrl = "/";
    //uploadUrl = "http://m2.fun.tv/file.php"
    return (
      <KForm ref="form">
        <div className="form-group"></div>
        <div className="form-group f1" style={{display:"none",width:100}}>
          <label className="form-label">名称：</label>
          <KInput disabled={disabled} name="input1" className="abc" rule=".+###^[a-zA-Z]+$" error="必填###只能填英文"></KInput>
        </div>
        <div className="form-group">
          <label className="form-label">名称：</label>
          <KInput disabled={disabled} name="input2" className="abc" rule={this.verifyFunc.bind(this)} error="必填"></KInput>
        </div>
        <div className="form-group">
          <label className="form-label">单选切换：</label>
          <KSwitch disabled={disabled} name="raidogroup" value='2' rule=".+" error="必填"></KSwitch>
        </div>

        <div className="form-group">
          <label className="form-label">单选框组：</label>
          <KRadioGroup disabled={disabled} name="raidogroup" value='2' rule=".+" error="必填">
            <KRadio value="1">选项A</KRadio>
            <KRadio value="2">选项A</KRadio>
          </KRadioGroup>
        </div>
        <div className="form-group">
          <label className="form-label">单选组：</label>
          <KRadio disabled={disabled} name="radio" value="1" rule=".+" error="必填">选项A</KRadio>
        </div>
        <div className="form-group">
          <label className="form-label">单选框组：</label>
          <KCheckBoxGroup disabled={disabled} name="checkboxgroup" rule=".+" error="必填">
            <KCheckBox value="1">选项A</KCheckBox>
            <KCheckBox value="2">选项A</KCheckBox>
          </KCheckBoxGroup>
        </div>
        <div className="form-group">
          <label className="form-label">单选组：</label>
          <KCheckBox disabled={disabled} name="checkbox" value="1" rule=".+" error="必填">选项A</KCheckBox>
        </div>
        <div className="form-group">
          <label className="form-label">下拉框:</label>
          <KSelect style={{height:100}}>
            {
              [1,2,3,4,5,6,7,8,9.10].map( (item,i)=>{
                return <KSelectOption key={i}>{item}</KSelectOption>
              })
            }
          </KSelect>
        </div>
        <div className="form-group">
          <KImage mode='fill' src="//www.baidu.com/img/flexible/logo/pc/result.png" />
        </div>
        <div className="form-group">
          <KFile disabled={disabled} name="file" accept=".jpg,.mp4"
            rule=".+" error="必填"
           server={uploadUrl} autoupload={true} multiple={false}></KFile>
        </div>
        <div className="form-group">
          <KFile disabled={disabled} name="file-mutilple" accept=".jpg,.mp4"
            rule=".+" error="必填"
           server={uploadUrl} autoupload={true} multiple={true}></KFile>
        </div>
        <div className="form-group">
          <KImageUpload disabled={disabled} name="file-image" accept=".jpg"
            rule=".+" error="必填"
           server={uploadUrl} multiple={false}></KImageUpload>
        </div>
        <div className="form-group">
          <KImageUpload disabled={disabled} name="file-image-mutilple" cols={3} accept=".jpg"
            rule=".+" error="必填"
           server={uploadUrl} multiple={true}></KImageUpload>
        </div>
        
        <div className="form-group">          
          <KButton disabled={disabled} className="test" onClick={this.onSubmitHandler.bind(this)}>提交</KButton>
          <KButton className="test" onClick={this.onParamsHandler.bind(this)}>表单参数</KButton>
        </div>
      </KForm>
    )
  }
}

render(<App />, document.querySelector("#app"));