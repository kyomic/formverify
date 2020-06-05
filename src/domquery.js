(function( context ){
	var utils = {}
	utils.isdom = function( obj ){
		if( !obj ) return false;
		if( obj instanceof HTMLElement ){
			return true;
		}
		if( typeof obj =='object' && obj.nodeType == 1){
			return true;
		}
		if( obj == document )return true;
		return false;
	}
	var factory = function( selector, context ){
		return new query( selector, context )
	}

	factory.each = function( selector , func ){
		var nodes = factory( selector );
		if( nodes.length ){
			for(var i=0;i<nodes.length;i++){
				var res = func.call(nodes[i], i, nodes[i]);
				if( res && Boolean(res)==false ){
					break;
				}
			}
		}
	}
	var query = function(selector, doc ){
		this.context = doc ? ( doc.length ? doc[0] :doc ) : document;
		var nodes = {};
		nodes.__proto__ = {
			valHooks:{
				option:{
					get:function( elem ){
						var text = elem.text || elem.textContent || elem.innerText;
						elem = query( elem );
						var val = elem.attr("value");
						if( val == null ){
							val = text;
						}
						return val;
					}
				},
				select:{
					get:function( elem ){
						var value, option, options = elem.options,
                    		index = elem.selectedIndex;//当前选中项 单选默认0，多选默认-1
                    	var one = true;
                    	if( index == -1 || elem.type =='select-multiple'){
                    		one = false;
                    	}
                    	var max = one ? index + 1: options.length;//单选最大为1,多选为options.length
                    	values = one ? null : [];//one为true，则values为null，否则为[]
                    	var i = index < 0 ? max : (one ? index : 0);
                    	for ( ; i < max; i++ ) {//遍历
                    		option = options[ i ];
                    		//不支持optgroup
                    		if (  option.selected || i === index ){
                    			value = query( option ).val();
                    			if( one ){
                    				return value;
                    			}
                    			values.push( value );//多选推入数组
                    		}
                    		
                    	}
                    	return values;
					},
					set:function( elem, value ){
						var optionSet, option,options = elem.options;
						var values = this.makeArray( value );
						var i = options.length;//选项数量
						var find = false;
						while ( i-- ) {
                    		option = options[ i ];
                    		var val = factory(option).val();
                    		if ( values.indexOf( val )!=-1 ) {
                    			option.selected = true;
                    			find = true;
                    		}
                    	}
                    	if( !find ){
                    		elem.selectedIndex = -1;
                    	}
                    	return value;
					}
				},				
				checkbox:{
					set:function( elem, value ){
						var values = this.makeArray( value );
						if( values.indexOf( factory( elem).val() )!=-1){
							elem.checked = true;
						}
					}
				}
			},
			makeArray:function( obj ){
				var res = [];
				if( typeof obj == 'object' && obj.length ){
					for(var i=0;i<obj.length;i++){
						res.push( obj[i])
					}
				}else{
					res = [obj];
				}
				return res;
			},
			first:function(){
				var node = this[0];
				return node;
			},
			hasClass:function( name ){
				var node = this.first();
				if( !node ) return false;
				if( node.classList ){
					for(var i=0;i<node.classList.length;i++){
						if( node.classList[i] == name ){
							return true;
						}
					}
					return false;
				}else{
					return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'))
				}
			},
			addClass:function( name ){
				factory.each( this,function( i, node ){
					if( node.classList ){
						var list = name.replace(/(^\s+|\s+$)/g, '').split(/\s+/g);
						for(var i=0;i<list.length;i++){
							if( list[i] ){
								node.classList.add( list[i] );
							}
						}
					}else{
						node.className += " " + name;
					}
				})
			},
			removeClass:function( name ){
				var self = this;
				factory.each(this,function(i, node ){
					if( node.classList ){
						var list = name.replace(/(^\s+|\s+$)/g, '').split(/\s+/g);
						for(var i=0;i<list.length;i++){
							if( list[i] ){
								node.classList.remove( list[i] );
							}
						}
					}else{
						if( self.hasClass( name )){
							var list = name.replace(/(^\s+|\s+$)/g, '').split(/\s+/g);
							for(var i=0;i<list.length;i++){
								var reg = new RegExp('(\\s|^)' + list[i] + '(\\s|$)')
								node.className = node.className.replace( reg,' ');
							}
						}
					}
				})
			},
			/**
			 * @example
			 * css({color:'red'})
			 * css('color','red');
			 */
			css:function( prop, val ){
				var iset = typeof val != 'undefined';
				if( iset ){
					factory.each( this, function(i,node){						
						if( typeof prop == 'object'){
							for( var key in prop ){
								node.style[key] = prop[key];
							}
						}else{
							node.style[prop] = val
						}
					})
				}else{
					var node = this.first();
					if( node ){
						var style = getComputedStyle(this);
						return style[prop];
					}
					return '';
				}
			},
			attr:function( attr, val ){
				var node = this.first();
				var iset = typeof val != 'undefined';
				if( !node ){
					return iset? this : null;
				}
				if( iset ){
					node.setAttribute( attr, val );
					return this;
				}else{
					return node.getAttribute( attr );
				}
			},
			prop:function( attr, val ){
				var iset = typeof val != 'undefined';
				var node = this.first();
				if( !node ) return iset ? this:null;
				if( iset ){
					try{
						node[ attr ] = val;
					}catch(e){}
					return this;					
				}else{
					return node[attr];
				}
			},
			data:function( attr, val ){
				return this.attr('data-' + attr, val );
			},
			val:function( val ){
				var iset = typeof val != 'undefined';
				var tag = '';
				var node = null;
				var self = this;
				if( !iset ){
					//getter
					node = this.first();
					if( !node ) return null;
					var hook = this.valHooks[node.type || node.tagName.toLowerCase() ];
					if( hook && typeof hook.get=='function'){
						return hook.get.call( self, node );
					}
					var ret = ( node.value || '');
					if( typeof ret =='string'){
						ret = ret.replace(/\s/ig,'');
					}
					return ret;
				}else{
					factory.each(this,function(i,item){
						node = this;
						var hook = self.valHooks[node.type || node.tagName.toLowerCase()];
						if( hook && typeof hook.set == 'function'){
							hook.set.call( self, node, val )
						}else{
							node.setAttribute('value',val);
						}
					})
				}
				return this;
			}
		}
		nodes.__proto__.valHooks['select-multiple'] = nodes.__proto__.valHooks['select-one'] = nodes.__proto__.valHooks['select'];
		nodes.__proto__.valHooks['radio'] = nodes.__proto__.valHooks['checkbox']

		if (typeof selector === 'string') {
			//是字符串
			var temp = this.context.querySelectorAll(selector);
			for (var i = 0; i < temp.length; i++) {
			   nodes[i] = temp[i]
			}
			nodes.length = temp.length;
		} else {
			if( utils.isdom( selector )){
				//dom
				nodes[0] = selector;
				nodes.length = 1;
				return nodes;
			}else{
				return selector;
			}
			
		}
		return nodes;
	}
	if( typeof context.$ != 'undefined'){

	}else{
		window.$ = factory
	}
})( self || this )