<template>
  <div>
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: 'KFormElement',
  data(){
    return {
      guid: 'kui' + (~~(Math.random()* 1000)),
      //组件的真实值
      value:'',
      //有些组件有二态，未选中value为空，cacheValue用于缓存实际值
      cacheValue:'',
      //是否表单校验出错
      verifyError:false,
      defaultClassName:'form-control'
    }
  },
  computed:{

  },
  props:{
    className:{
      type:String
    }
  },
  methods:{
    /** 组件的样式类名 **/
    getClassName(){
      return this.defaultClassName + " " + (  this.verifyError?" form-control-error ":"") + (this.className || '')
    },
    errorInfo( msg ){
      this.verifyError = true;
      let wrapper = this.$el;
      let err = wrapper.querySelector('.err-tip');
      if( !err ){
        err = document.createElement('span');
        err.className = 'err-tip';
        wrapper.appendChild( err )
      }
      err.innerHTML = msg;
    },
    errorClear(){
      this.verifyError = false;
      let wrapper = this.$el;
      let err = wrapper.querySelector('.err-tip');
      if( err ){
        err.innerHTML = '';
      }
    }
  },
  mounted(){
    this.rule = this.$attrs["rule"]||''
    this.error = this.$attrs["error"]||''
    this.name = this.$attrs['name']||''
    this.value = this.$attrs['value']||'';
    this.defaultValue = this.$attrs['value'];
    this.cacheValue = this.value;
  },
}
</script>