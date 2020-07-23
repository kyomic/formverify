<template>
  <div class="form">
    <slot></slot>
  </div>  
</template>
<script>
import {verify} from '@/lib/utils/verify.js'
let verify_api = verify;
export default {
  name: 'KForm',

  data(){
    return {
      elements:[]
    }
  },

  computed:{},

  methods:{
    params(){
      let param = {};
      this.elements.map(ele=>{
        if( ele.name ){
          param[ ele.name ] = ele.value
        }
      })
      return param;
    },
    verify(){
      let childs = this.elements;
      let result = null;
      for(let i=0;i< childs.length ;i++){
        result =this.verifyElement( childs[i] );
        if( !result || (typeof result=='object' && !result.result)){
          result = false;
          break;
        }
      }
      return result;
    },
    verifyElement( component ){
      let {value,rule,error} = component;
      let res = verify_api.verify( component, { value, rule, error })
      if( !res || (typeof res=='object' && !res.result) ){
        component.errorInfo( res ? res.error: verify_api.option.error )
        return res;
      }else{
        component.errorClear();
      }
      return true;
    }
  },
  mounted(){
    let childs = (this.$children || []).filter(ele=>{
      return ele && ele.defaultClassName == 'form-control'
    })
    this.elements = childs;
    this.elements.map(ele=>{
      //console.log("控件:", ele.name, ele)
      ele.$on('blur',evt=>{
        this.verifyElement( ele )
      })
      ele.$on('change',evt=>{
        this.verifyElement( ele )
      })
    })
  },
}
</script>