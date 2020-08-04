<template>
  <div>
    <button @click="onClickHandler($event)"><slot></slot></button>
  </div>  
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