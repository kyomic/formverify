<template>
  <div class="form-control">
    <slot></slot>
  </div>  
</template>
<script>
import { KFormElement } from './index.js'
export default {
  name: 'KCheckBoxGroup',
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
      let values = [];
      childs.map(ele=>{
        if( ele.checked ){
          values.push( ele.value || ele.cacheValue )
        }
      })
      this.value = values.join(',')
    }
  },
  mounted () {    
    this.elements = (this.$children || []).filter(ele=>{
      return ele && ele.defaultClassName == 'form-control'
    })
    this.checkValue();
    this.elements.map(ele=>{
      //标记ele在按纽组中
      /** 默认值配置 */
      if( this.defaultValue ){
        let arr = this.defaultValue.split(",")
        if( arr.indexOf( ele.cacheValue )!=-1){
          ele.checked = true;
        }
        this.checkValue();
      }
      ele.group = true;
      ele.$on('change', evt =>{
        this.checkValue();
        this.$emit('change')
      })
    })
  }
}
</script>