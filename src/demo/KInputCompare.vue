<template>
  <div :class="getClassName()" >
    <input ref="input_a" @blur='onBlurHandler' @keyup='onChangeHandler($event)' />
    <input ref="input_b" @blur='onBlurHandler' @keyup='onChangeHandler($event)' />
  </div>  
</template>
<script>

import { KFormElement } from '@/lib/ui/KFormElement.js'
let KInputCompare = {
  name: 'KInputCompare',
  extends: KFormElement,
  props: [],
  data () {
    return {

    }
  },
  methods:{
    onBlurHandler:function(){
      //触发焦点丢事件，Form.verify校验表单项正确性
      this.$emit('blur')
    },
    onChangeHandler:function(e){
      this.value_a = this.$refs.input_a.value;
      this.value_b = this.$refs.input_b.value;
    }
  },
  mounted () {
    this.value_a = this.$refs.input_a.value;
    this.value_b = this.$refs.input_b.value;
  }
}
export default KInputCompare
export {KInputCompare}

</script>