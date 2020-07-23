<template>
  <div class="form-control">
    <slot></slot>
  </div>  
</template>
<script>
import { KFormElement } from './KFormElement.js'
export default {
  name: 'KRadioGroup',
  extends: KFormElement,
  props: [],
  data () {
    return {
      value:''
    }
  },
  methods:{
    checkValue(){
      let childs = this.elements;
      let values = '';
      childs.map(ele=>{          
        if( ele.checked ){
          values = ele.value || ele.cacheValue;
        }
      })
      this.value = values;
    }
  },
  mounted () {    
    this.elements = (this.$children || []).filter(ele=>{
      return ele && ele.defaultClassName == 'form-control'
    })
    this.checkValue();
    this.elements.map(ele=>{
      //标记ele在按纽组中  
      ele.name = this.name;    
      ele.group = true;
      /** 默认值配置 */
      if( this.defaultValue ){
        if( ele.cacheValue == this.defaultValue ){
          ele.checked = true;
        }
        this.checkValue();
      }
      ele.$on('change', evt =>{
        this.elements.map( ui => ui.checked = false )
        ele.checked = true;        
        this.checkValue();
        this.$emit('change')
      })
    })
  }
}
</script>