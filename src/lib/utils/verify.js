;(function(){


let verify_config = {
  lazy:0, //是否懒惰检测，即调用FormVerify.verify时校验
  autoscroll:true, //自动滚动window,让组件在视图中
  error:"验证不通过",
  divider:"###",
}
let verify = {}
verify.option = Object.assign({}, verify_config );
verify.config = function( opt ){
  this.option = Object.assign(this.option, opt || {})
  return this;
}
verify.isFunction = function( func ){
  if( typeof func == 'function'){
    return func;
  }else{
    if( typeof func == 'string' ){
      let arr = func.split('.');
      var context = self||window;
      while( context ){
        var n = arr.shift();
        if( n ){
          context = context[n];
          if( typeof context == 'undefined'){
            return false;
          }
        }
        if( arr.length ==0 && typeof context =='function'){
          return context;
        }
      }
    }
  }
  return false;
}
/**
 * 校验选项数据的可用性
 * @param {DOM/VNode} dom - DOM对象
 * @param {object} opt - 选项数据,如{value, rule, error}
 */

verify.verify = function( dom, opt ){
  let { value, rule, error } = opt;
  console.log("校验:", opt)
  if( !rule ){
    return true;
  }else{
    let divider = this.option.divider || verify_config.divider;
    let rules = [];
    if( typeof rule=='string'){
      rules = rule.split( divider );
    }else{
      if( typeof rule =='function'){
        rules = [rule];
      }
    }
    let errors = ( error || "").split( divider );
    error = this.option.error;
    let res = { result: true, error: error, target: dom }
    for( let i=0; i<rules.length; i++){
      if( rules[i] ){
        error = errors[i] || this.option.error;
        var func = this.isFunction( rules[i] );
        if( typeof func == 'function'){
          res = func.bind(this)(value, dom);          
          if( !res ){
            break;
          }
          //typeof res =='object'  webpack error
          if( typeof res!='boolean' && typeof res.hasOwnProperty == 'function' && res.result == false ){
            break;
          }
        }else{
          let reg = null;
          try{
            reg = new RegExp( rules[i], 'ig');
          }catch(e){}
          //修复值为undefined的情况
          if( typeof value =='undefined'){
            value = '';
          }
          if( reg && reg.exec( value )){
          }else{
            res.result = false;
            res.error = error;
            break;
          }
        }
      }
    }
    if( typeof res == 'boolean' ){
      res = { result: res }
    }
    if( typeof res == 'undefined'){
      res = { result: true }
    }
    res.error = res.error || error;
    res.target = res.target || dom;
    if( !res.result ){
      return res;
    }
  }
  return true;
}

  
  //兼容CommonJs规范
  if (typeof module !== 'undefined' && module.exports) {
      module.exports = verify;
      return;
    }
    //兼容AMD/CMD规范
    if (typeof define === 'function'){
      define(function() { return verify; });
      return;
    }
    self.verify = verify;
})( self );
