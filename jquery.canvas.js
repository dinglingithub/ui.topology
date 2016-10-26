/*-------------------------------------

  the jquery-xx.js is required
  
  @author ding__lin@hotmail.com

-------------------------------------*/

(function(){
	
	$.fn.container = function(options){
		var defaults = {
			
		};
		var opts = $.extend(defaults,options);
		
		this.config = opts;
		
		this.model = 'topology';
		this.setIntervalFlag = false; 
		
		this.css({ "width":"100%" ,"height":"100%" , "position":"absolute" });
		this.canvas = $('<canvas width="1024" height="800"/>');
		this.canvas.appendTo(this);
		this.g = this.canvas[0].getContext('2d');
		
		this.server = new Image();
		this.server.src = './asset/server64.png';
		this.server.container = this;
		this.route = new Image();
		this.route.src = './asset/route128.png';
		this.route.container = this;
		this.db = new Image();
		this.db.src = './asset/db.png';
		this.db.container = this;
		
		this.instance = {} ;
		this.instance.container = this;
		this.getInstance = function(){
			return this.instance;
		}
		
		this.servers = [];
		
		this.initlink = function(){
			if ( this.config && this.config.links && this.config.servers){
				this.g.lineWidth = 2;
				for ( var i in this.config.links ){
					var link = this.config.links[i];
					this.g.strokeStyle = link.color;
					this.g.shadowBlur=20;
					this.g.shadowColor="blue";
					this.g.moveTo( this.config.servers[link.p1].x + 30 , this.config.servers[link.p1].y + 30 );
					this.g.lineTo( this.config.servers[link.p2].x + 30 , this.config.servers[link.p2].y + 30);
				}
				this.g.stroke();
			}
		}
		
		$(this.route).bind('load' , function(){
			if ( this.container.config && this.container.config.servers ){
				for ( var i in this.container.config.servers){
					if ( i.indexOf('route') == 0 ){
						var server = this.container.config.servers[i]
						$(this).device({image:this,name:i,data:server});
					}
				}
			}
		});
		
		$(this.db).bind('load' , function(){
			if ( this.container.config && this.container.config.servers ){
				for ( var i in this.container.config.servers){
					if ( i.indexOf('db') == 0 ){
						var server = this.container.config.servers[i]
						$(this).device({image:this,name:i,data:server});
					}
				}
			}
		});
		
		$(this.server).bind('load' , function(){
			//$(this).trigger("imgComplete");
			if ( this.container.config && this.container.config.servers ){
				for ( var i in this.container.config.servers){
					if ( i.indexOf('server') == 0 ){
						var server = this.container.config.servers[i]
						$(this).device({image:this,name:i,data:server});
					}
				}
			}
		});
		
		this.initlink();
		
		this.markbt ;
		
		$(this).button({container:this,name:'topology',x:300,y:10});
		$(this).button({container:this,name:'list',x:540 , y : 10 });
		$(this).button({container:this,name:'mark',x:300,y:10});
		
		this.sortDevice = function(){
			var indexs = getRandoms(this.servers.length , this.servers.length , []);
			for ( var i in this.servers){
				this.servers[i].sort(indexs[i]);
			}
		}
		
		return this;
	}
	
	$.fn.device = function(options){
		var defaults = {
			colors:['#00d3e0','#b89b72','#da8faf','#7a7ed6','#e6bf25','#74c08f','#fb9a70','#00d3e0'],
			_n:10
		};
		this.config = $.extend(defaults,options);
		var _n = this.config._n;
		this.div = $('<div/>');
		this.canvas = $('<canvas/>');
		
		if ( this.config.type && this.config.type == 'bar'){
			
		}else{
			this.config.type = 'icon';
			this.div.attr("id",this.config.name);
			//this.div.append(this.config.name);
			this.div.css({ "left":this.config.data.x - _n ,"top":this.config.data.y - _n , "width": 64 + 2*_n  ,"height":64 + 2*_n , "position":"absolute" , transitionProperty:'height' , transitionDuration : '500' });
			this.div.appendTo(this.config.image.container);
			this.canvas.appendTo(this.div);
			this.g = this.canvas[0].getContext('2d');
			this.g.shadowBlur=_n;
			this.g.shadowColor="black";
			this.g.drawImage(this.config.image , _n , _n , 64 , 64);
			this.div.bind('mouseover',function(e){
				
			});
			
			this.div.attr("id",this.config.name);
			this.div.css({ "left":this.config.data.x - _n ,"top":this.config.data.y - _n , "width": 64 + 2*_n  ,"height":64 + 2*_n , "position":"absolute" });
			this.div.appendTo(this.config.image.container);
			this.config.image.container.servers.push(this);
		}
		
		this.transform = function(type){
			if ( type == this.config.type)
				return ;
			this.config.type = type;
			if ( type == 'bar'){
				this.config.image.container.g.clearRect(0 , 0 , 1024 , 800);
				this.div.css({backgroundColor: this.config.colors[this.config.data.index] ,opacity:0.2});
				this.canvas.css({opacity:1});
				this.div.addClass('ui-flipswitch');
				this.div.animate({"width": 700  ,"height":84 , "left": 100 , "top": 30 + this.config.data.index * 85 , opacity:0.9} , 1000 );
			}else{
				//this.config.image.container.initlink();
				var _n = 10;
				this.div.removeClass('ui-flipswitch');
				this.div.css({backgroundColor: 'Transparent' });
				this.div.animate({ "left":this.config.data.x - _n ,"top":this.config.data.y - _n , "width": 64 + 2*_n  ,"height":64 + 2*_n , 
					"position":"absolute" } , 1000 );
			}
		}
		
		this.sort = function(index){
			if (this.config.type == 'bar'){
				/*if ( this.div.position().top < (30 + index * 85) ){
					var nn = 30 + index * 85 - this.div.position().top;
					
					this.div.animate({"height": 0 ,"top": 30 + index * 85 + nn/2 } , 500 );
					this.div.animate({"height":84 ,"top": 30 + index * 85 } , 500 );
				}else{
					this.div.animate({"height":84 ,"top": 30 + index * 85 } , 1000 );
				}*/
				
				this.div.animate({"height":84 ,"top": 30 + index * 85 } , 1000 );
			}
		}
		return this;
	}
	
	$.fn.button = function(options){
		var defaults = {
			width:120,
			height:30,
			topology:'拓扑视图',
			list:'列表视图'
			
		};
		this.config = $.extend(defaults,options);
		this.div = $('<div id="bt_'+ this.config.name +'" class="round" type="'+this.config.name+'">'+this.config[this.config.name]+'</div>');
		
		if ( this.config.name == 'mark'){
			this.div.css({border:'1px solid gray'});
			this.div.css({ "left":this.config.x ,"top":this.config.y , "width": this.config.width  ,"height":this.config.height , 
				"position":"absolute" , veriticalAlign:'middle' , textAlign:'center'});
			this.div.html('');
			this.config.container.markbt = this.div;
		}else{
			this.div.css({ "left":this.config.x ,"top":this.config.y + 5 , "width": this.config.width  ,"height":this.config.height , 
				"position":"absolute" , veriticalAlign:'middle' , textAlign:'center'});
		}
		
		this.canvas = $('<canvas/>');
		
		this.div.appendTo(this.config.container);
		this.div.bind('click',function(e){
			vcontainer.model = $(e.target).attr('type');
			if ( $(e.target).attr('type') == 'list'){
				if ( vcontainer.servers){
					for ( var i in vcontainer.servers){
						vcontainer.servers[i].transform('bar');
					}
					if ( vcontainer.setIntervalFlag == false ){
						setInterval('sort();' , 3000);
					}
					vcontainer.setIntervalFlag = true;
					vcontainer.markbt.animate({left:540});
				}
			}else if ( $(e.target).attr('type') == 'topology'){
				if ( vcontainer.servers){
					for ( var i in vcontainer.servers){
						vcontainer.servers[i].transform('icon');
					}
					vcontainer.markbt.animate({left:300});
					setTimeout(initlink , 1400);
					//$(this).oneTime('1s',initlink);
				}
			}
		});
		return this;
	}
	
	$.fn.deviceTips = function(options){
		var defaults = {
			
		};
		this.config = $.extend(defaults,options);
		this.div = $('<div/>');
		this.div.attr("id",this.config.name);
		this.div.append(this.config.name);
		this.div.css({ "left":this.config.x ,"top":this.config.y, "width":"64" ,"height":"64" , "position":"absolute" });
		this.div.appendTo(this.config.container);
		this.config.container.servers.push(this.div);
		this.div.bind('mouseover',function(e){
			
		});
		return this;
	}
	
})(jQuery);

//----------------------
//
//  Global variable or function
//
//----------------------

var vcontainer ;

function sort(){
	if ( vcontainer.servers && vcontainer.model == 'list'){
		var indexs = getRandoms(vcontainer.servers.length , vcontainer.servers.length , []);
		for ( var i in vcontainer.servers){
			vcontainer.servers[i].sort(indexs[i]);
		}
	}
}

function initlink(){
	if ( vcontainer.model = 'topology')
		vcontainer.initlink();
}

function getRandoms( totle , length , array ){
	if ( !array )
		array = [];
	if ( length <= 0 )
		return array;
	var n = Math.random();
	n = Math.ceil(n * totle);
	var match = true;
	for ( var j in array ){
		if ( array[j] == n ){
			match = false;
			break;
		}
	}
	if ( match){
		array.push(n);
		return getRandoms( totle ,length - 1 , array );
	}else{
		return getRandoms( totle ,length, array );
	}
}
