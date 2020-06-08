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
	/**
	 * 对字符串进行哈希计算
	 * @name utils.stringhash
	 * @function
	 * @grammar stringhash(str[, len])
	 * @param {String} str 目标字符串
	 * @param {Integer} len 产生哈希字符串长度 默认: 32
	 * @returns {String} 哈希后的字符串
	 */
	utils.stringhash = function( str, len ){
	    /* 对两个字符串进行异或运算
	     */
	    var stringxor = function( s1, s2 ) {
	        var s = '', hash = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', max = Math.max( s1.length, s2.length );
	        for ( var i = 0; i < max; i++ ) {
	            // 将两个字符串对应字符的 Unicode 编码进行异或运算
	            // 把运算结果取模, 去字符表中取对应字符
	            var k = s1.charCodeAt( i ) ^ s2.charCodeAt( i );
	            s += hash.charAt( k % 52 );
	        }
	        return s;
	    };
	    len = len || 32;
	    var start = 0, i = 0, result = '', filllen = len - str.length % len;
	    //使用字符0,将字符串长度补齐为哈希长度的倍数
	    for ( i = 0; i < filllen; i++ ) {
	        str += "0";
	    }
	    //将字符串分成 (str/len) 份,将上一次哈希后的字符串与下一组字符串进行哈希
	    while ( start < str.length ) {
	        result = stringxor( result, str.substr( start, len ) );
	        start += len;
	    }
	    return result;
	}
	context.utils = utils;

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
	factory.makeArray = function( obj ){
		var res = [];
		if( typeof obj == 'object' && obj.length ){
			for(var i=0;i<obj.length;i++){
				res.push( obj[i])
			}
		}else{
			res = [obj];
		}
		return res;
	}

	var eventCache = {};
	var tagMap = {
			UL       : 1,
            OL       : 2,
            LI       : 3,
            INPUT    : 4,
            DIV      : 5,
            BODY     : 6,
            STRONG   : 7,
            SPAN     : 8,
            FORM     : 9,
            BUTTON   : 10,
            CAPTION  : 11,
            FIELDSET : 12,
            COLGROUP : 13,
            TFOOT    : 14,
            LABEL    : 15,
            LEGEND   : 16,
            THEAD    : 17,
            OPTGROUP : 18,
            OPTION   : 19,
            SELECT   : 20,
            TABLE    : 21,
            TBODY    : 22,
            IFRAME   : 0,
            SCRIPT   : 0,
            OBJECT   : 0,
            EMBED    : 0,
            IMG      : 0
	}
	var query = function( selector, doc ){
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
						var values = factory.makeArray( value );
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
						var values = factory.makeArray( value );
						if( values.indexOf( factory( elem).val() )!=-1){
							elem.checked = true;
						}
					}
				}
			},
			domid:function(){
				var paths = [];
				var node = this.first();
				while(node && node.nodeName.toUpperCase()!='BODY'){
					var index = 0;
					var tagName = node.nodeName.toUpperCase();
	                for ( var i = node.previousSibling; i; i = i.previousSibling ) {
	                    var d = i.nodeName.toUpperCase();
	                    if ( tagMap[ d ] === 0 ) {
	                        continue;
	                    }
	                    if ( d == tagName ) {
	                        ++index;
	                    }
	                }
	                tagName = tagMap[ tagName ] || tagName;
	                var tindex = (index ? "!" + (index + 1) : "");
                	paths.splice( 0, 0, tagName + tindex );
                	node = node.parentNode;
				}
				return utils.stringhash(paths.join(''));
			},
			first:function(){
				var node = this[0];
				return node;
			},
			last:function(){
				if( this.length ){
					return this[ this.length - 1];
				}
				return null
			},
			parent:function(){
				var node = this.first();
				return $(node.parentNode())
			},
			//元素之后
			after:function( query ){
				query = factory(query);
				var node = this.first();
				var sub = query.length ? query[0]:query;
				if( node && sub ){
					var parent = node.parentNode;
					parent.insertBefore( sub, node.nextSibling );
				}
				return this;
			},
			//元素之前
			before:function( query ){
				query = factory(query);
				var node = this.first();
				var sub = query.length ? query[0]:query;
				if( node && sub ){
					var parent = node.parentNode;
					console.log("p",parent)
					parent.insertBefore(sub, node);
				}
				return this;
			},
			//元素内部第一个位置
			prepend:function( query ){
				query = factory(query);
				var node = this.first();
				var sub = query.length ? query[0]:query;
				if( node && sub ){
					if( node.childNodes.length ){
						node.insertBefore( sub, node.childNodes[0].nextSibling );
					}else{
						node.appendChild( sub );
					}
				}
			},
			//元素内的最后一个位置
			append:function( query ){
				query = factory(query);
				var node = this.first();
				var sub = query.length ? query[0]:query;
				if( node && sub ){
					node.appendChild( sub );
				}
			},
			contain:function( query ){
				var node = this.first();
				if( !node )return false;
				var child = query.length ? query[0] : query;
				if( !child ) return false;
				if( child == node ) return true;
			    let p = child.parentNode;
			    while(p){
			        if( p == node ){
			            return true;
			        }
			        p = p.parentNode;
			    }
			    return false;
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
			},
			//event
			on:function( event, handler ){
				var self = this;
				factory.each( this, function(i,node){
					var id = factory(node).domid()
					var evt = eventCache[ id ] || {};
					var func = evt[ event ] || [];
					func.push( handler )	
					node.addEventListener( event, handler );

					evt[event] = func;
					eventCache[ id ] = evt;
				})
			},
			off:function( event, handler){
				var self = this;
				factory.each( this, function(i,node){
					var id = factory(node).domid()
					var evt = eventCache[ id ] || {};
					var func = evt[ event ] || [];
					if( typeof handler =='function'){
						var idx = func.indexOf( handler );
						if( idx !=-1){
							func.splice(idx, 1);							
						}
						node.removeEventListener( event, handler );
					}else{
						for(var i=0;i<func.length;i++){
							node.removeEventListener( event, func[i] );
						}
						func = [];
					}
					evt[ event ] = func;
					eventCache[id] = evt;
					
				})
			},
			trigger:function( event ){
				var node = this.first();
				if( node){
					var id = factory(node).domid()
					var evt = eventCache[ id ] || {};
					var func = evt[ event ] || [];
					for(var i=0;i<func.length;i++){
						try{
							func.call(node,event);
						}catch(e){}
					}
				}
			},
			delegate:function( event, query, handler ){
				var self = this;
				this.on( event , function(e){
					var sub = factory(query, this);
					var tar = e.target;
					if( sub.contain(tar)){
						if( handler.call(this, event) === false ){
			                e.stopPropagation();
			                try{
			                    e.cancelBubble = true;
			                }catch(e){}
			            }
					}
				})
			},
			undelegate:function(event,query,handler){
				this.off(event,handler);
			}
		}
		nodes.__proto__.valHooks['select-multiple'] = nodes.__proto__.valHooks['select-one'] = nodes.__proto__.valHooks['select'];
		nodes.__proto__.valHooks['radio'] = nodes.__proto__.valHooks['checkbox']

		if (typeof selector === 'string') {
			if(/</ig.exec( selector )){
				throw new Error("** unsupport html code");
			}else{
				var temp = this.context.querySelectorAll(selector);
				for (var i = 0; i < temp.length; i++) {
				   nodes[i] = temp[i]
				}
				nodes.length = temp.length;
			}
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