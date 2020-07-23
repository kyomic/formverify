<template>

  <div :class="getClassName()" v-if="group">
    <label><slot></slot>
      <input :name="name" ref="radio" type="radio" @change="onChangeHandler($event)" />
    </label>
  </div>
  <!-- not in group -->
  <div v-else :class="getClassName()">
    <div :class="getCheckStateClassName()">
      <label><slot></slot>
        <input ref="radio" type="radio" @change="onChangeHandler($event)" />
      </label>
    </div>
  </div>
</template>
<script>
import { KFormElement } from './KFormElement.js'
export default {
  name: 'KRadio',
  extends: KFormElement,  
  computed:{     
    componentChecked(){
      return this.checked;
    }
  },
  data () {
    return {
      checked:false,
      group:false,//是否被内嵌在radio-group中
    }
  },
  methods:{    
    /** 组件的样式类名 **/
    getClassName(){
      if( this.group ){
        this.defaultClassName = 'radio';
      }
      let cls = this.defaultClassName;
      if( this.verifyError ){
        cls += " form-control-error";
      }
      if( this.componentChecked ){
        cls += ' radio-checked '
      }
      cls += (this.className || '')
      return cls;
    },
    getCheckStateClassName(){
      let cls = 'radio';
      if( this.componentChecked){
        cls += ' radio-checked '
      }
      return cls;
    },
    onBlurHandler:function(e){
      this.$emit('blur');
    },
    
    onChangeHandler:function(e){
      this.checked = !this.checked;
      this.$refs.radio.checked = this.checked;
      this.updateValue();
      this.$emit('change')
    },
    updateValue(){
      if( !this.checked ){
        this.value = '';
      }else{
        this.value = this.cacheValue;
      }
    }
  },
  mounted () {
    if( this.$attrs['checked'] || typeof this.$attrs['checked']!='undefined'){
      this.checked = true;
    }
    if( this.checked ){
      this.$refs.radio.checked = true;
    } 
    this.updateValue();
  }
}
</script>