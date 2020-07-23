<template>
  <div>
    <input :value="value" ref="element" @blur="onBlurHandler($event)" @keyup='onChangeHandler($event)' :class="getClassName()" />
  </div>
</template>
<script>
import { KFormElement } from './KFormElement.js'
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
      this.value = e.target.value;
    }
  },
  mounted () {
  }
}
</script>