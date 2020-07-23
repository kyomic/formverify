<template>
  <option ref="option"><slot></slot></option>
</template>
<script>
import { KFormElement } from './KFormElement.js'
export default {
  name: 'KSelectOption',
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
  },
  mounted () {
  }
}
</script>