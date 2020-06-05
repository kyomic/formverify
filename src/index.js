(function( context ){
	var FormVerifyOptions = {
		lazy:0, //是否懒惰检测，即调用FormVerify.verify时校验
		autoscroll:true, //自动滚动window,让组件在视图中
		error:"验证不通过",
		elementClass:"form-control"
	}
	var FormVerify = function(){}
	FormVerify.getFormElementValue = function( element ){
		var nodes = $(element);
		if( nodes.hasClass( this.option.elementClass )){
			var node = nodes.first();
			if( node ){
				var tagname = node.tagName.toLowerCase();
				switch( tagname ){
					case 'div':
						var inputs = $("input", node );
						if( inputs && inputs.length ){
							return inputs.val();
						}
						break;
					default:
						return nodes.val();
						break;
				}
			}
		}else{
			throw new Error("** 不是标准的FormElement,请指定类名:", this.option.elementClass );
		}
	}
	/**
	 *
	 * return {result,message,target} or boolean
	 */
	FormVerify.verifyElement = function( element ){
		var nodes = $(element);
		var rules = nodes.data('rule');
		if( rules ){
			rules = rules.split("###");
			var errors = (nodes.data('error')||"").split("")
			for(var i=0;i<rules.length;i++){
				var error = errors[i] || this.option.error;
				var res = {result:true,message:error,target: nodes }
				//优先取  data-value
				var val = this.getFormElementValue( element );
				if( rules[i] ){					
					if( typeof window[rules[i]] == 'function'){
						res = window[rules[i]].call( this, nodes )
					}else{
						var reg = null;
						try{
							reg = new RegExp(rules[i],'ig');
						}catch(e){}
						if( reg && reg.exec( val )){
						}else{
							res.result = false;
			                break;
			            }
					}
					res.error = res.error || error;
				}
				if( !res || !res.result){
					break;
					return res;
				}
			}
		}else{
			return true;
		}

	}

	FormVerify.verify = function( content, option ){
		this.option = Object.assign( Object.assign( {}, FormVerifyOptions ), option || {});
		var result = null;
		var self = this;
		$.each($("." + this.option.elementClass, content ),function(i, item){
			console.log("item",$(item).attr('name')||$(item).data('name'), "values===", self.getFormElementValue(item) )
			//result = FormVerify.verifyElement( item );
			//if( !result || result.result == false ){
			//	return false;
			//}
		});
	}

	FormVerify.register = function( context, options ){

	}
	FormVerify.register( context );

	context.FormVerify = FormVerify;
})(self||this)