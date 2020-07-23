<template>
  <div>
    kfile
  </div>  
</template>
<script>
export default {
  name: 'KFile',

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