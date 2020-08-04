<template>
  <option ref="option"><slot></slot></option>
</template>
<script>
import { KFormElement } from './index.js'
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