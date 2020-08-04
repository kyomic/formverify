<template>

  <div :class="getClassName()" v-if="group">
    <label><slot></slot>
      <input ref="checkbox" type="checkbox" @change="onChangeHandler($event)" />
    </label>
  </div>
  <!-- not in group -->
  <div v-else :class="getClassName()">
    <div :class="getCheckStateClassName()">
      <label><slot></slot>
        <input ref="checkbox" type="checkbox" @change="onChangeHandler($event)" />
      </label>
    </div>
  </div>
</template>
<script>
import { KFormElement } from './index.js'
export default {
  name: 'KCheckBox',
  extends: KFormElement,  
  computed:{     
    componentChecked(){
      return this.checked;
    }
  },
  data () {
    return {
      checked:false,
      group:false,//是否被内嵌在checkbox-group中
    }
  },
  methods:{    
    /** 组件的样式类名 **/
    getClassName(){
      if( this.group ){
        this.defaultClassName = 'checkbox';
      }
      let cls = this.defaultClassName;
      if( this.verifyError ){
        cls += " form-control-error";
      }
      if( this.componentChecked ){
        cls += ' checkbox-checked '
      }
      cls += (this.className || '')
      return cls;
    },
    getCheckStateClassName(){
      let cls = 'checkbox';
      if( this.componentChecked){
        cls += ' checkbox-checked '
      }
      return cls;
    },
    onBlurHandler:function(e){
      this.$emit('blur');
    },
    
    onChangeHandler:function(e){
      this.checked = !this.checked;
      this.$refs.checkbox.checked = this.checked;
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
      this.$refs.checkbox.checked = true;
    } 
    this.updateValue();
  }
}
</script>