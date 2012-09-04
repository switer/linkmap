window.LinkMap = ( function () {
	var LinkMap = function ( prexi ) {
		this._prexi = typeof prexi === 'string' ? prexi : 'cs_';
		this._data = {};
		this._index = 0;
		this.length = 0;
	}
	return LinkMap;
} )();
( function ( lm ) {
	var lmp = lm.prototype;
	/**			Attributes			**/
	/**
     *	delete all properties
     **/
    lm.insertPlace = lmp.insertPlace = {
    	BEFORE : -1,
    	AFTER : 1	
    }

    /**			Functions 			**/
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
    lmp.clear = function(){
    	this.each( function ( item, key ) {
    		delete this._data[key];
    	}, this );
    };
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
		_func.each.call(this, this._data, func, ctx );
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
		return this.map( index ).value;
	}
	lmp.index = function ( key ) {
		var skey = _func.getKey.call( this, key );
		var returnIndex = -1;
		this.each( function( item, key, index ) {
			if (key === key ) {
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
		if  ( !skey ) return false;
		this.each( function (item, key) {
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
		console.log(skey, breakpoint, subSetTemp);
		if ( !insertobj.key ) insertobj.key = this._prexi + this._index; 
		//默认取before
		if( !place || place === this.insertPlace.BEFORE ){
            //删除当前插入位置的值
            delete this._data[skey];
            //插入新的值
            this._data[insertobj.key] = insertobj.value;
            //往新的值后面添加刚才删除的插入点的值
            this._data[skey] =  breakpoint;
            
        } else{ //往插入点后插入
            this._data[insertobj.key] = insertobj.value;
        }

        _func.each.call(this, subSetTemp, function ( item, key, index ) {
        	this._data[key] = item;
        } );

		this._index ++;
		this.length ++ ;
        return true;
	}
	/**
	*	获取键值对
	**/
	lmp.map = function ( index ) {

		var val = {};

		if ( typeof index === 'number' ) {
			this.each( function ( item, key, ind ) {
				console.log(ind);
				if ( index === ind ) {
					val = {
						'key' : key,
						'value' : item
					};
					return true;
				}
			});
		} else if ( typeof index === 'string' ) {
			/*
			*case 1 : index is string can trans to a number,
			*case 2 : index is string have prexi,
			*case 3 : index is string have no prexi can't trans to a number
			*/
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
	lmp.key = function (index) {
		return this.map(index).key;
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
	lmp.pop = function ( item ) {
		return this.get( -- this.length );
	}
	/**
	*	获取当前LinkMap实例的前缀
	**/
	lmp.prexi = function () {
		return this._prexi;
	}
	/**
	*	往最末端添加一个值
	**/
	lmp.push = function ( item, key ) {
		var skey = key || this._index;
		skey = this._prexi + skey;
		if ( this.exist(skey) ) return;
		this._data[skey] = item;
		this._index ++
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
		var key = this.key(index);
		if (key) {
			this._data[key] = item;
			return true;
		}
		return false;
		
	}
	lmp.subSet = function ( startInd, endInd ) {
		if ( typeof startInd === 'string' ) startInd = this.index(startInd);
		if ( typeof endInd === 'string' ) endInd = this.index(endInd);
		var isBegin = false;
		this.each(function ( item, key, index ) {

		});


	}
	/**
	*	LinkMap数据转换为JSON String
	**/
	lmp.toString =  function () {
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
		each : function (clt, func, ctx , breaker) {
			var index = 0;
			breaker = breaker || function () {};
			if ( !ctx ) ctx  = this;
			for ( var key in clt ) {
				if ( clt.hasOwnProperty( key ) ) {
					
					
					//迭代, 返回true时满足终止条件
					if( func.call( ctx, clt[key], key, index ++ ) ) return;
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
})( LinkMap );
