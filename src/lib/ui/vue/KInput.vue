<template>
  <input type="text" :value="value" ref="element" @blur="onBlurHandler($event)" @keyup='onChangeHandler($event)' :class="getClassName()" />
</template>
<script>
import { KFormElement } from './index.js'
export default {
  name: 'KInput',
  extends: KFormElement,
  props: [],
  data () {
    return {

    }
  },
  computed:{
    
  },
  methods:{
    onBlurHandler:function(e){
      this.$emit('blur');
    },
    onChangeHandler:function(e){
      console.log('this', this, this.$vm)
      this.value = e.target.value;
    }
  },
  mounted () {
  }
}
</script>