<template>
  <div>
    <select :class="getClassName()" ref="select" @change="onChangeHandler($event)" multiple v-if="multiple">
      <slot></slot>
    </select>
    <select :class="getClassName()" ref="select" @change="onChangeHandler($event)" v-else>
      <slot></slot>
    </select>
  </div>
</template>
<script>
import { KFormElement } from './KFormElement.js'
export default {
  name: 'KSelect',
  extends: KFormElement,  
  computed:{     
    componentChecked(){
      return this.checked;
    }
  },
  data () {
    return {
      multiple:false,
      checked:false,
      group:false,//是否被内嵌在radio-group中
    }
  },
  methods:{    
    onChangeHandler(e){
      let element = this.$refs.select;
      let selectedIndex = element.selectedIndex;
      if( !this.multiple ){
        if( this.elements[ selectedIndex ]){
          this.value = this.elements[ selectedIndex ].value
        }else{
          this.value = this.defaultValue ||"";
        }
      }else{
        let values = [];
        this.elements.map( ele =>{
          let el = ele.$el;
          if( el.selected ){
            values.push( ele.value || ele.cacheValue )
          }
        })
        this.value = values.join(',')
      }
      this.$emit('change')
      
    }
  },
  mounted () {
    this.defaultValue = this.$attrs['value'] || '';
    if( this.$attrs["multiple"] || (typeof this.$attrs["multiple"]!='undefined')){
      this.multiple = true;
    }
    this.elements = (this.$children || []).filter(ele=>{
      if( this.defaultValue ){
        //多选默认值
        let values = this.defaultValue.split(",");
        let value = ele.value || ele.cacheValue;
        if( values.indexOf( value )!=-1){
          ele.$el.selected = true;
        }
      }
      return ele && ele.defaultClassName == 'form-control'
    })
  }
}
</script>