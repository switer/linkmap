/*window.LinkMap = ( function () {
	var _index = 0;
	var LinkMap = function ( prexi ) {
		this._prexi = typeof prexi === 'string' ? prexi : 'cs_' + _index;
		this._data = {};
		this._index = 0;
		this.length = 0;
		_index ++ ;
	}
	return LinkMap;
} )();*/
( function ( ) {

	var cache = {};

	var lm = window.LinkMap = ( function () {
		var _index = 0;
		var _data = {};
		var LinkMap = function ( prexi ) {
			this._prexi = typeof prexi === 'string' ? prexi : 'cs_' + _index;
			cache[this._prexi] = {
				index : 0,
				length : 0,
				data : _data
			}
			this._data = {};
			this._index = 0;
			this.length = 0;
			_index ++ ;
		}
		return LinkMap;
	} )();

	var lmp = lm.prototype;
	
	/**			Attributes			**/
	/**
     *	all properties
     **/
    lm.BEFORE = lmp.BEFORE = -1;
    lm.AFTER = lmp.AFTER = 1;
    lm.VERSON =	lmp.VERSON ='1.0.0';
    /**			Functions 			**/

	/**
	*	插入一个集合
	**/
	lmp.addBefore = function ( index, value, key ) {
		var o = key ? { "value" : value, "key" : key} : {"value" : value};
		this.insert(index, o, this.BEFORE);
	}
	lmp.addAfter = function ( index, value, key ) {
		var o = key ? { "value" : value, "key" : key} : {"value" : value};
		this.insert(index, o, this.AFTER);
	}
	lmp.addSet = function ( index , set, place ) {
		return this.insert( index, { 'clt' : set }, place );
	}
    /**
    *	数据集转换为数组
    **/
    lmp.array = function () {
		var newArr = [];
		this.each( function ( item, key, index ) {
			newArr[index] = item;
		} );
		return newArr;
	}
	lmp.cat = function ( clt ) {
		if ( clt instanceof Array !== true && clt instanceof Object !== true ) {
			return false;
		}
		return this.insert( this.length - 1, { "clt" : clt }, this.AFTER );
	}
    lmp.clear = function(){
    	this._data = {};
    	this.length = 0;
    	this._index = 0;
    }
	lmp.cutSet = function (  startInd, endInd, isCreate ) {
		this.subSet( startInd, endInd, null, true );
		return this;
	}
	/**
	*	删除一个下标值或者键值
	**/
	lmp.delete = function ( index ) {
		var status = false;
		var key = this.key( index );
		if ( key ) {
			delete this._data[key];
			status = true;
			this.length --;
		}
		return status;
	}
	/**
	*	迭代LinkMap数据
	**/
	lmp.each = function ( func, ctx ) {
		_func.each.call( this, this._data, func, ctx );
	}
	/**
	*	检查一个下标或者键是否存在
	**/
	lmp.exist = function ( key ) {
		var skey =  _func.getKey.call( this, key );
		if ( this._data.hasOwnProperty( skey ) ) return true;
		else return false;
	}
	/**
	*	获取下标或键所对应的值
	**/
	lmp.get = function ( index ) {
		var e = this.map( index );
		return e ? e.value : undefined;
	}
	/**
	*
	**/
	lmp.index = function ( key ) {
		if ( typeof key === "number" ) {
			return key;
		}
		var skey = _func.getKey.call( this, key );
		var returnIndex = -1;
		this.each( function( item, key, index ) {
			if ( key === key ) {
				return true;
				returnIndex = index;
			}
		}, this );
	}
	/**
	*	往指定下标或键前插入值
	**/
	lmp.insert = function ( index, insertobj, place ) {
		var isFinded = false, breakpoint, subSetTemp = {}, skey = this.key(index);
		if  ( !skey && this.length !== 0 ) return false;
		this.each( function ( item, key ) {
			//当找到插入点时，裁剪的子集为插入点后的集合，不包含插入点
			if ( isFinded === true ) {
				subSetTemp[key] = item;
				delete this._data[key];
			}
			//查找插入点，标志set值
			if ( skey === key ) {
				isFinded = true;
				breakpoint = item;
			}
		} );
		//把值放进一个集合里
		var clt, isBefore = false;
		if ( insertobj.clt ) {
			console.log("is collection");
			clt = insertobj.clt;
		} else if ( !insertobj.key ) {
			insertobj.key = this._prexi + this._index;
		} else {
			clt = {};
			clt[insertobj.key] = insertobj.value;
		}
		//默认取before
		if ( ( !place || place === this.BEFORE ) && this.length !== 0 ) {
            //删除当前插入位置的值
            delete this._data[skey];
            this.length -- ;
            isBefore = true;
        }
        //插入新的值
        if ( clt instanceof Array === true ) {
        	_func.each( clt, function ( item, index ) {
        		var skey = this._prexi + this._index;
        		this._data[skey] = item;
        		this._index ++ ;
        		this.length ++;
        	}, this );
        } else {
        	_func.each( clt, function ( item, key, index ) {
        		this._data[key] = item;
        		this._index ++ ;
        		this.length ++ ;
        	}, this );
        }
        //如果是往断点前插入数据，需要在插入对象后添加会这个断点
        if ( isBefore ) {
            //往新的值后面添加刚才删除的插入点的值
            this._data[skey] =  breakpoint;
            this.length ++;
        } 
        _func.each( subSetTemp, function ( item, key, index ) {
        	this._data[key] = item;
        }, this );
        return true;
	}

	/**
	*	获取该坐标所对应的下一个元素
	**/
	lmp.next = function ( index ) {
		if ( typeof index === 'number' ) {
			if ( index < 0 || index >= this.length ) return;
			return this.get( index + 1 );
		} else if ( typeof index === 'string' ) {
			var ind = this.index( index );
			if (ind === ( length - 1 )) return;
			return this.get( ind + 1 );
		}
	}
	/**
	*	获取键值对
	**/
	lmp.map = function ( index ) {
		var val;
		if ( typeof index === 'number' ) {
			this.each( function ( item, key, ind ) {
				if ( index === ind ) {
					val = {
						'key' : key,
						'value' : item
					};
					return true;
				}
			});
		} else if ( typeof index === 'string' ) {
			var skey = _func.getKey.call( this, index );
			val = {
				'key' : skey,
				'value' : this._data[skey]
			} 
		} 
		return val;
	}
	/**
	*	获取下标或键所对应的内部键, 不存在时返回undefined
	**/
	lmp.key = function ( index ) {
		var e = this.map( index );
		return e ? e.key : undefined;
	}
	/**
	*	转换成普通的json数据对象
	**/
	lmp.object =  function () {
		var object = {};
		this.each( function ( item, key ) {
			object[key] = item;
		} );
		return object;
	}
	/**
	*	弹出LinkMap数据的末端的值
	**/
	lmp.pop = function () {
		var e = this.map( -- this.length );
		if ( e ) {
			delete this._data[e.key];
		}
		return e;
	}
	/**
	*	获取当前LinkMap实例的前缀
	**/
	lmp.prexi = function () {
		return this._prexi;
	}
	/**
	*	获取当前指定下标对应前一个值
	**/
	lmp.pre = function ( index ) {
		if ( typeof index === 'number' ) {
			if ( index <= 0 || index >= this.length ) return;
			return this.get( index - 1 );
		} else if ( typeof index === 'string' ) {
			var ind = this.key( index );
			if (ind === 0 ) return;
			return this.get( ind - 1 );
		}
	}
	/**
	*	往最末端添加一个值
	**/
	lmp.push = function ( item, key ) {
		var lc = cache[this._prexi];
		var skey = key || this._index;
		skey = this._prexi + skey;
		if ( this.exist( skey ) ) return;
		this._data[skey] = item;
		this._index ++;
		this.length ++;
		return skey;
	}
	/**
	*	反转
	**/
	lmp.reverse = function ( ) {
	}
	/**
	*	更新指定下标或键的值
	**/
	lmp.set = function ( index, item ) {
		var key = this.key( index );
		if ( key ) {
			this._data[key] = item;
			return true;
		}
		return false;
	}
	/**
	*	获得一个子集
	**/
	lmp.subSet = function ( startInd, endInd, prexi, isCut ) {
		if ( typeof startInd === 'string' ) startInd = this.index( startInd );
		if ( typeof endInd === 'string' ) endInd = this.index( endInd );
		var startKey = this.key( startInd ),
			endKey = this.key( endInd );
		if ( startInd === -1 || endInd === -1 || !startKey || !endKey || endInd < startInd ) {
			return;
		}
		var isBegin = false, isEnd = false;
		var subSet;
		if ( isCut !== true ) subSet = new LinkMap( prexi );
		else subSet = this;
		this.each( function ( item, key, index ) {
			if ( isCut === true ) {
				//标志子集开始点
				if ( startKey === key ) isBegin = true;
				if ( !isBegin || isEnd ) delete this._data[key];
				if ( endKey === key ) isEnd = true;				
			} else {
				//标志子集开始点
				if ( startKey === key ) isBegin = true;
				if ( isBegin ) subSet.push( item, key );
				if ( endKey === key ) return true;
			}
		}, this );
		return subSet;
	}
	/**
	*	LinkMap数据转换为JSON String
	**/
	lmp.toString =  function () {
		if ( !JSON ) return "[Object LinkMap]";
		return JSON.stringify(this.object());
	}
	var _pvAtt = function () {
		var data = {};
		this.get =  function (key) {
			return data[key];
		};
		this.set = function (key ,value) {
			data[key]  = value;
		};
		this.delete = function (key) {
			return delete data[key];
		};
	}
	var _func = {
		each : function (clt, func, ctx ) {
			var index = 0;
			if ( !ctx ) ctx  = this;
			if ( clt instanceof Array === false ) {
				for ( var key in clt ) {
					if ( clt.hasOwnProperty( key ) ) {
						//迭代, 返回true时满足终止条件
						if( func.call( ctx, clt[key], key, index ++ ) ) return;
					}
				}
			} else if ( clt instanceof Array === true ) {
				for ( var i = 0, len = clt.length; i < len; i ++ ) {
					//迭代, 返回true时满足终止条件
					if( func.call( ctx, clt[i], index ++ ) ) return;
				}
			}
		},
		isNaN : function ( e ) {
			return e !== e;
		},
		//判断是否带有前缀从而返回该值
		getKey : function ( index ) {
			return index.indexOf( this._prexi ) === -1 ? this._prexi + index : index;
		},
	};
})(  );
