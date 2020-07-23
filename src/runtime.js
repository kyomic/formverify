(function(){
	let verify_config = {
	lazy:0, //是否懒惰检测，即调用FormVerify.verify时校验
	autoscroll:true, //自动滚动window,让组件在视图中
	error:"验证不通过",
	divider:"###"
}
let verify = {}
verify.option = Object.assign({}, verify_config );
verify.config = function( opt ){
	this.option = Object.assign(this.option, opt || {})
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


	console.log('runtime.version')
	//兼容CommonJs规范
	if (typeof module !== 'undefined' && module.exports) {
    	module.exports = verify;
    	return;
    }
    //兼容AMD/CMD规范
    if (typeof define === 'function'){
    	define(function() { return factory; });
    	return;
    }
	console.log(this, module)
})( self )