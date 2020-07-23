<template>
  <div>
    <KForm ref="form">
      <div class="form-group">
        <label class="form-label">名称：</label>
        <KInput name="input1" value='abc'></KInput>
      </div>
      <div class="form-group">
        <label class="form-label"><i class="required">*</i>名称(正则校验)：</label>
        <KInput name="input2" value='def' className="abc 124" ref="abc" rule=".+###^[a-zA-Z]+$" error="必填###只能填英文"></KInput>
      </div>
      <div class="form-group">
        <label class="form-label">复选框组</label>
        <KCheckBoxGroup name="checkboxgroup" rule=".+">
          <KCheckBox value="111">AAA</KCheckBox>
          <KCheckBox value="222">BBB</KCheckBox>
        </KCheckBoxGroup>
      </div>

      <div class="form-group">
        <label class="form-label">单选框组</label>
        <KRadioGroup name="radiogroup" rule=".+">
          <KRadio value="111">AAA</KRadio>
          <KRadio value="222">BBB</KRadio>
        </KRadioGroup>
      </div>
      <div class="form-group">
        <label class="form-label">复选框</label>
        <KCheckBox name="checkbox1" value="1" rule=".+">A</KCheckBox>
      </div>
      <div class="form-group">
        <label class="form-label"><i class="required">*</i>文本域：</label>
        <KTextArea name='textarea'></KTextArea>
      </div>
      <div class="form-group">
        <label class="form-label"><i class="required">*</i>下拉框：</label>
        <KSelect name="select" rule=".+">
          <KSelectOption value="">请选择</KSelectOption>
          <KSelectOption value="2">222</KSelectOption>
          <KSelectOption value="1">111</KSelectOption>
        </KSelect>
      </div>
      <div class="form-group">
        <label class="form-label"><i class="required">*</i>下拉框(多选)：</label>
        <KSelect name="select-mutiple" multiple rule=".+">
          <KSelectOption value="">请选择</KSelectOption>
          <KSelectOption value="2">222</KSelectOption>
          <KSelectOption value="1">111</KSelectOption>
        </KSelect>
      </div>
      <div class="form-group">
        <label class="form-label"><i class="required">*</i>函数校验：</label>
        <KInput className="abc 124" ref="abc" :rule="verifyFunc"></KInput>
      </div>
      <div class="form-group">
        <label class="form-label"><i class="required">*</i>自定义复合组件：</label>
        <KInputCompare className="abc 124" ref="abc" :rule="verifyFuncCompare"></KInputCompare>
      </div>
      <div class="form-group">
        <KButton @click="onCheckHandler()">校验</KButton>
        <KButton @click="onSubmitHandler()">表单数据</KButton>
      </div>
    </KForm>
  </div>
</template>

<script>
import {
  KForm,KInput,KButton,KCheckBox,KCheckBoxGroup,KRadio,KRadioGroup,KTextArea,KSelect,KSelectOption} from '@/lib/ui/index.js'
import {KInputCompare} from './KInputCompare.vue'
export default {
  name: 'App',
  components:{
    KForm,KInput,KButton,KCheckBox,KCheckBoxGroup,KRadio,KRadioGroup,KTextArea,KSelect,KSelectOption,
    KInputCompare,
  },
  data(){
    return {
    }
  },

  computed:{},

  methods:{
    verifyFunc:function( val, component ){
      if( val ) return true;
      return {result:false}
    },
    verifyFuncCompare:function( val, component ){
      let res = {result:true,target:component};
      if( !component.value_a || !component.value_b){
        res.error = '输入框必须填写'
        res.result = false;
      }
      if( component.value_a > component.value_b ){
        res.error = '前输入框的值必须小于后输入框值'
        res.result = false;
      }
      
      return res;
    },
    onCheckHandler:function(e){
      let form = this.$refs.form;
      let res = form.verify();
      console.log('校验结果', res)
      if( res ){
        console.log("params", form.params())
      }
    },
    onSubmitHandler:function(){
      let form = this.$refs.form;
      console.log("表单参数", form.params())
    }
  },
  mounted(){}
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
