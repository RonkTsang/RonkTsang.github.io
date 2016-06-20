/*获取样式*/
function getStyle(obj, name)
{
	if(obj.currentStyle)
	{
		return obj.currentStyle[name];
	}
	else
	{
		return getComputedStyle(obj, false)[name];
	}
}
/*让物体开始运动*/
function startMove(obj, attr, iTarget)
{
	clearInterval(obj.timer);
	obj.timer=setInterval(function (){
		var cur=0;
		cur=parseInt(getStyle(obj, attr));
		var speed=(iTarget-cur)/8;
		speed=speed>0?Math.ceil(speed):Math.floor(speed);
		
		if(cur==iTarget)
		{
			clearInterval(obj.timer);
		}
		else
		{
			obj.style[attr]=cur+speed+'px';
		}
	}, 20);
}
/*通过子级的class获取相应的元素集合*/
function getByClass(oParent, sClass)
{
	if(oParent.getElementsByClassName){
		return oParent.getElementsByClassName(sClass);
	}else{
		var aResult=[];
		var aEle=oParent.getElementsByTagName('*');
		for(var i=0;i<aEle.length;i++)
		{
			if(aEle[i].className==sClass)
			{
				aResult.push(aEle[i]);
			}
		}
		return aResult;
	}
}

window.onload = function(){
	var header = document.getElementById('header');
	var main = document.getElementById('main');
	var oSide = document.getElementsByTagName('aside')[0];
	var sideDiv = oSide.getElementsByTagName('div');
	var oImg = main.getElementsByTagName('img')[0];
	var oArt = main.getElementsByTagName('div')[1];
	var icon = header.getElementsByTagName('div')[0];
	var sign = header.getElementsByTagName('div')[1];
	var welcome = document.getElementById('welcome');
	var welText = welcome.getElementsByTagName('h1')[0];
	var line = welcome.getElementsByTagName('div')[0];
	var back = sideDiv[sideDiv.length-1];
	var article = document.getElementById('article');
	var show = document.getElementById('show');
	var picUl = show.getElementsByTagName('ul')[0];
	var desUl = show.getElementsByTagName('ul')[1];
	var footer = document.getElementsByTagName('footer')[0];
	var aDot = getByClass(show,'dot');
	var extr = document.getElementById('extr');

	var hasClick = false;   //头像图标是否已经被点了一次
	var hasSide = false;		// 当前是否打开了侧边栏
	
	oImg.style.transform = 'translate(0px,-400px) ';  // 页面进入后的起始动画
	line.style.transform = 'translateX(0)';
	line.style.opacity = '1';
	line.style.filter = 'alpha(opacity:100)';

	var nowDot = 0;        // 当前的点
	var nowPic = 0;				//当前的图片
	var path = ['photos.html','Music.html','comment.html'];  //进入按钮的路径

	var timer = setInterval(picScroll,4000);		//让图片每隔4秒滚动一次

	var aPic = picUl.getElementsByTagName('li');  //图片合集

	for(var i=0;i<aPic.length;i++){						// 给每张图片加鼠标移入移出事件
		aPic[i].onmouseover = function(){				// 移入时，暂停滚动
			clearInterval(timer);
			this.style.transform = 'scale(1.3,1.2)';
		}
		aPic[i].onmouseout = function(){				// 移出恢复滚动
			timer = setInterval(picScroll,4000);
			this.style.transform = '';
		}
	}

	for(var i=0;i<aDot.length;i++){			//给每个点加点击和移出事件
		aDot[i].index = i;
		aDot[i].onclick = function(){
			if(nowPic==3||nowDot==this.index){	//判断要选图片是不是当前图片
				return false;											// 是，则返回；
			}
			aDot[nowDot].className = 'dot';			//当前点的样式为普通
			this.className = 'dot active';			//所选点的样式为active
			nowPic = nowDot = this.index;				//记录现在、最新的点和图片序号
			extr.href = path[nowDot];						//更新按钮入口的路径
			choosePic(nowPic);									//切换至相应图片

			this.onmouseout = function(){
				clearInterval(timer);
				timer = setInterval(picScroll,4000);
			}
		}
	}

	/*图片滚动*/
	function picScroll(){
		aDot[nowDot].className = 'dot';
		nowDot++;
		nowPic++;
		if(nowDot == 3){					// 已经到最后一个点，返回第一个
			nowDot = 0;
		}
		if(nowPic == 4){				// 已经最后一张图片，将图片和文字描述返回第一个
			picUl.style.top = 0;
			desUl.style.left = 0;
			nowPic = 1;
		}
		aDot[nowDot].className ='dot active';
		extr.href = path[nowDot];
		startMove(desUl,'left',-480*nowPic);
		startMove(picUl,'top',-500*nowPic);
	}

	/*由图片序号选择图片*/
	function choosePic(nowPic){
		clearInterval(timer);
		startMove(picUl,'top',-500*nowPic);
		startMove(desUl,'left',-480*nowPic);
	}

	/*当发生滚动时*/
	window.onscroll = function(){
		var top = document.documentElement.scrollTop || document.body.scrollTop;
		//记录滚动的高度
		if(top>=200 && top<400){														//滚动高度200-400
			header.style.background='rgba(255,255,255,0.5)'; // 头部为半透明
			welText.style.transform = 'translateX(50px)';		//文字和线移动消失
			line.style.transform = 'translateX(-50px)';
			welText.style.opacity = line.style.opacity = '0';
			show.style.opacity = article.style.opacity = '1'; // 展示区淡出

		}else if (top>=400) {																//滚动高度>400
			if(hasSide){
				header.style.background='rgba(255,255,255,0.5)'; //有侧栏，半透明
			}else{
				header.style.background='rgba(255,255,255,1)';	 		
			}
			header.style.color = '#595959';	
			header.style.boxShadow = '0px 0px 5px #A6A6A6';	
			show.style.opacity = article.style.opacity = '1';		
		}else{
			header.style.background='rgba(255,255,255,0)';  // 重置header样式
			header.style.color = 'white';
			header.style.boxShadow = '';
			oImg.style.transform = 'translateY('+(top-400)+'px)';
			welText.style.opacity = line.style.opacity = '1';
			line.style.transform = welText.style.transform = 'translateX(0)';		
			show.style.opacity = article.style.opacity = '0';
		}

		footer.style.height=oriHeight+'px';							// 页脚回到原来状态
		footer.style.top = originTop;
		footer.children[0].style.opacity = '1';
	}

	/*头像图标点击事件，及侧栏返回事件*/
	back.onclick = icon.onclick = function(){
		var bodyTop =document.body.scrollTop || document.documentElement.scrollTop;
		if(!hasClick){														// icon还没被点击
			main.style.transform = 'translateX(330px)';
			oSide.style.transform = 'translateX(25px)';
			icon.style.transform = 'translateY(200px)';
			icon.style.backgroundColor = 'white';
			oImg.style.transform = 'translate(-200px,-400px) scale(0.9,0.9)';
			sign.style.opacity = 0;
			sign.style.filter='alpha(opacity:0)';
			var delay = 1;													 // 侧栏内容元素出现的延迟
			for(var i=0;i<sideDiv.length;i++){
				delay += 0.5;													// 每次延迟0.5s；
				sideDiv[i].style.transition = delay+'s';
				sideDiv[i].style.transform = 'translateX(60px)';
			}
			if(bodyTop>=400){
				header.style.background='rgba(255,255,255,0.5)';
				header.style.boxShadow = '0px 0px 5px #A6A6A6';
			}
			hasClick = true;
			hasSide = true;

		}else{
			hasClick = false;
			hasSide = false;
			var delay = 0.5;
			oSide.style.transform =	main.style.transform = 'translateX(0px)';
			oImg.style.transform = 'translate(0px,-400px) ';
			icon.style.transform = 'translateY(0px)';
			icon.style.backgroundColor = '';
			sign.style.opacity = 1;
			sign.style.filter='alpha(opacity:100)';
			for(var i=0;i<sideDiv.length;i++){
				delay += 0.5;
				sideDiv[i].style.transition = delay+'s';
				sideDiv[i].style.transform = 'translateX(0px)';
			}
	
			if(bodyTop>=400){
				header.style.background='rgba(255,255,255,1)';
				header.style.color = '#595959';
				header.style.boxShadow = '0px 0px 5px #A6A6A6';
			}else if(bodyTop>=200){
				header.style.background='rgba(255,255,255,0.5)';
			}else{
				header.style.background='rgba(255,255,255,0)';
				header.style.color = 'white';
				header.style.boxShadow = '';
			}
		}
	}

	var nowDate = new Date();              			  // 日期对象
	var oDate = document.getElementById('date');
	setInterval(function(){												 // 更新侧栏中显示的日期
		oDate.innerHTML = nowDate.getFullYear()+'.'+
			(nowDate.getMonth()+1)+'.'+nowDate.getDate();
	},1000)
	
	var footer = document.getElementsByTagName('footer')[0];
	footer.style.top=footer.offsetTop+'px';					// 将footer转为绝对定位 
	footer.style.position = 'absolute';
	
	var originTop = getStyle(footer,'top');					// footer原始top
	var oriHeight = footer.offsetHeight;						// footer的原始高度
	var maxHeight = document.documentElement.clientHeight;	//限定最大高度
	maxHeight = maxHeight>900?maxHeight-10:900;
	
	footer.onmousewheel = function(ev){							//在footer上滑动鼠标事件
		var oEvent=ev||event;
		var delta = oEvent.wheelDelta;
		var top = document.documentElement.scrollTop || document.body.scrollTop;
		this.children[0].style.opacity = '0';
		this.style.transition = '0.3s';
		if(delta>0){																	//滚轮向上滑动
			if(this.offsetHeight>oriHeight*2){					 
			this.style.height=(this.offsetHeight-150)+'px';   //高度逐渐减小150px
			this.style.top = (this.offsetTop+150)+'px';				// 同时向下移动150px
			}else{
				this.style.height=oriHeight+'px';							//高度小于原有高度2倍时
				this.style.top = originTop;										//直接返回至初始位置
				this.children[0].style.opacity = '1';
			}
		}else if(delta<0){															//滚轮向下移动
			if(this.offsetHeight<maxHeight){							// 高度最大达到maxHeight
				this.style.top = (this.offsetTop-100)+'px';
				this.style.height=(this.offsetHeight+100)+'px';
			}else{
				header.style.background = 'rgba(255,255,255,0)';
				header.style.color = 'white';
				// alert(this.offsetHeight);
			}
		}
		return false;																		//取消默认事件
	}

	var aInfo = getByClass(footer,'information');      
	var aHolder = getByClass(footer,'placeholder');
	var form = footer.getElementsByTagName('form')[0];

	for(var i=0;i<aInfo.length;i++){
		aInfo[i].index = i;
		aInfo[i].onkeydown = function(){         // 当开始填写信息时，预留信息移出
			aHolder[this.index].style.transform = 'translateX(-200px)';
		}
		aInfo[i].onblur = function(){
			if(!this.value){												//失去焦点，若未填写则预留信息返回
				aHolder[this.index].style.transform = '';
			}
		}
	} 

	var send = document.getElementById('send');  
	send.onclick = function(){
		return false;       // 该提交按钮目前只是例示，没有接受提交数据的脚本，故取消默认
	}
}
