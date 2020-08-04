<template>
  <button @click="onClickHandler($event)"><slot></slot></button>  
</template>
<script>
export default {
  name: 'KButton',

  data(){
    return {
    }
  },

  computed:{},

  methods:{
    onClickHandler:function(e){
      this.$emit('click')
    }
  },
  mounted(){
    
  },
}
</script>