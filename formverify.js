/*
 * formverify 
 * 简单的表单校验模块
 * https://github.com/kyomic/

 * Home:http://www.shareme.cn
 * Author:kyomic@163.com
 * Date: 2020-06-08T16:00Z
 */
 (function(){
	$.ready(function(){
		$('input,textarea').on('change',function(e){
			var element = $(this);
			var type = element.prop('type');
			if( ['checkbox','radio'].indexOf( type )!=-1){
				var checkedClass = 'checkbox-checked';
				if( type=='radio'){
					checkedClass = 'radio-checked';
					var name = element.prop('name');
					var checkboxs = element.closest(".form-control").find("input[name=" + name +"]");
					$.each(checkboxs,function(i,item){
						$(item).closest(".radio").removeClass(checkedClass);
					})
				}
				if( element.prop("checked")){
					element.parent().addClass( checkedClass )
				}else{
					element.parent().removeClass( checkedClass )
				}
			}
			FormVerify.error(element, FormVerify.verifyElement( element ) );
		});

		$.each($('.form-control'),function(i,item){
			var tagname = item.tagName.toLowerCase();
			item = $(item);
			var type = item.prop('type');
			var standareFormTag = ['select','input','button','textarea'];
			if( standareFormTag.indexOf(tagname)==-1){
				//自定义组件
				var val = item.data('value');
				var elements = $(standareFormTag.join(','), item );
				var sameTag = '';
				var sameType = '';
				var isSameTagGroup = true; //是否为同类表单组件集合
				$.each(elements,function(j,ele){
					ele = $(ele);
					var n = ele.first().tagName.toLowerCase();
					var t = ele.prop('type');
					if( !sameType ) sameType = t;
					if( !sameTag ) sameTag = n;
					if( (sameTag && n!= sameTag) || (sameType && t!= sameType)){
						isSameTagGroup = false;
						return false;
					}
				})
				//checkbox,radio组
				if( isSameTagGroup && sameType ){
					var values = (val||'').split(",");
					$.each(elements,function(j,ele){
						ele = $(ele);
						ele.closest('.' + sameType).removeClass( sameType + '-checked');
						if( values.indexOf( ele.val())!=-1){
							ele.prop('checked',true);
							ele.closest('.' + sameType).addClass( sameType + '-checked');
						}else{
							ele.prop('checked',false);
						}
					})
				}else{
					
				}
			}
		});
	})
})();

(function( context ){
	var FormVerifyOptions = {
		lazy:0, //是否懒惰检测，即调用FormVerify.verify时校验
		autoscroll:true, //自动滚动window,让组件在视图中
		error:"验证不通过",
		divider:"###",
		elementClass:"form-control"
	}
	var FormVerify = function(){}
	FormVerify.isFunction = function( str ){
		var arr = str.split('.');
		var context = window;
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
		return false;
	}
	FormVerify.getFormElementValue = function( element ){
		var nodes = $(element);
		if( nodes.hasClass( this.option.elementClass )){
			var node = nodes.first();
			if( node ){
				var tagname = node.tagName.toLowerCase();
				switch( tagname ){
					case 'div':
						var inputs = $("input", node );
						var value = '';
						var values = [];
						if( inputs && inputs.length ){
							$.each( inputs,function(i, input ){
								var el = $(input);
								if( el.attr('type') == 'radio' && el.prop("checked")){
									values.push( el.val() );
								}
								if( el.attr('type') == 'checkbox' && el.prop("checked")){
									values.push( el.val() );
								}
							})
						}
						return values.join(',')
					case 'select':
						return $.makeArray( nodes.val() ).join(',')
					case 'input':
						var type = nodes.prop('type');
						if(['radio','checkbox'].indexOf(type)!=-1){
							if( nodes.prop('checked')){
								return nodes.val();
							}else{
								return '';
							}
						}else{
							return nodes.val();
						}
						break;
					default:
						return nodes.val();
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
		var divider = this.option.divider;
		if( rules ){
			rules = rules.split(divider);
			var errors = (nodes.data('error')||"").split(divider);
			var error = this.option.error;
			var res = {result:true,message:error,target: nodes }
			for(var i=0;i<rules.length;i++){
				error = errors[i] || this.option.error;
				//优先取  data-value
				var val = this.getFormElementValue( element );
				if( rules[i] ){
					var func = FormVerify.isFunction( rules[i] );
					if( typeof func  == 'function'){
						res = func.call( this, nodes );
						if( !res || res.result == false ){
							break;
						}
					}else{
						var reg = null;
						try{
							reg = new RegExp(rules[i],'ig');
						}catch(e){}
						if( reg && reg.exec( val )){
						}else{
							res.result = false;
							res.message = error;
			                break;
			            }
					}
				}
			}
			if( !res ){
				res = {result:false}
			}
			res.message = res.message || error;
			res.target = res.target || nodes;
			if( !res || !res.result){
				return res;
			}
		}
		return true;

	}

	FormVerify.error = function( item, result ){
		item = $(item);
		if( !result || result.result == false ){
			var tip = $(item).parent().find('.err-tip');
			if( !tip ||!tip.length){
				tip = $(item).closest('.form-group').find('.err-tip');
			}
			if( tip && tip.length ){
				tip.html( result.message );
			}else{
				tip = $(document.createElement('div'));
				tip.addClass('err-tip')
				tip.html( result.message );
				var type = $(item).prop('type');
				if( ['radio','checkbox'].indexOf(type)!=-1){
					$(item).closest(".form-element").after( tip )
				}else{
					$(item).after(tip);
				}
				
			}
		}else{
			$(item).parent().find('.err-tip').remove();
			$(item).closest('.form-group').find('.err-tip').remove();
		}
	}

	FormVerify.verify = function( context, option ){
		this.option = Object.assign( Object.assign( {}, FormVerifyOptions ), option || {});
		var result = null;
		var self = this;
		$.each($("." + this.option.elementClass, context ),function(i, item){
			//console.log("item",$(item).attr('name')||$(item).data('name'), "values===", self.getFormElementValue(item) )
			var name = $(item).attr('name')||$(item).data('name');
			result = FormVerify.verifyElement( item );
			//console.log(name,'value=',self.getFormElementValue(item),  "校验结果", result)			
			FormVerify.error(item, result );
			if( !result || !result.result ){
				result = false;
			}
		});
		return result;
	}

	FormVerify.params = function( context ){
		var params = {};
		var self = this;
		$.each($("." + this.option.elementClass, context ),function(i, item){
			var name = $(item).attr('name')||$(item).data('name');
			var value = self.getFormElementValue( item );
			if( name ){
				params[name] = value;
			}
		});
		return params;
	}

	FormVerify.register = function( context, option ){
		this.option = Object.assign( Object.assign( {}, FormVerifyOptions ), option || {});
	}
	FormVerify.register( context );

	context.FormVerify = FormVerify;
})(self||this)