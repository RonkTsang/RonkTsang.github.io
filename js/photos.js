/*通过class获取元素*/
function getByClass(oParent, className) {
  if (oParent.getElementsByClassName) {
    return oParent.getElementsByClassName(className);
  } else {
    var aResult = [];
    var aEle = oParent.getElementsByTagName('*');

    for (var i = 0; i < aEle.length; i++) {
      if (aEle[i].className == className) {
        aResult.push(aEle[i]);
      }
    }
    return aResult;
  }
}

var path=['images/pet/','images/photo/','images/music/'];

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

/*物体运动*/
function goMove(obj, json)
{
	clearInterval(obj.timer);
	obj.timer=setInterval(function (){
		var hasStop=true;		//多值的情况，先假设所有值都已经变化完了
		
		for(var attr in json)
		{
			var cur=0;
			
			if(attr=='opacity')							//如果要更改的属性是 透明度 的情况
			{
				cur=Math.round(parseFloat(getStyle(obj, attr))*100);      // 原来的透明度 再四舍五入
			}
			else
			{
				cur=parseInt(getStyle(obj, attr));            					
			}
			
			var speed=(json[attr]-cur)/6;																// 缓冲直至到达属性到达点
			speed=speed>0?Math.ceil(speed):Math.floor(speed);						// 取整
			
			if(cur!=json[attr])
				hasStop=false;																							// 如果还没变化完，计时器不关闭
			
			if(attr=='opacity')
			{
				obj.style.filter='alpha(opacity:'+(cur+speed)+')';
				obj.style.opacity=(cur+speed)/100;
			}
			else
			{
				obj.style[attr]=cur+speed+'px';
			}
		}
		
		if(hasStop)
		{
			clearInterval(obj.timer);}
	}, 30);
}

window.onload = function() {
  var pShow = document.getElementById('photo_show');
  var imgBox = pShow.children[0];
  var aLi = pShow.getElementsByTagName('li');
  var oSide = document.getElementById('leftSide');
  var oImg = oSide.children[0];

  for (var i = 0; i < aLi.length; i++) {                 //将float定位转换为absolute
    aLi[i].style.left = aLi[i].offsetLeft + 'px';
    if (i >= 12) {
      aLi[i].style.top = 400 + 'px';
    } else {
      aLi[i].style.top = parseInt(i / 4) * 200 + 'px';
    }
  }

  for (var i = 0; i < aLi.length; i++) {
    aLi[i].style.position = 'absolute';
  }

  for (var i = 8; i < aLi.length; i++) {
    aLi[i].style.opacity = 0;
    aLi[i].style.filter = 'alpha(opacity:0)';
  }

  var oBtn = document.getElementById('turnPage');		//获取翻页按钮
  var prev = oBtn.getElementsByTagName('img')[0];
  var next = oBtn.getElementsByTagName('img')[1];

  var now = 0;																			//当前可视区域的第一张图片
  var hasFinish = true;															//上一次翻页是否完成
  next.onclick = function() {
    if(!hasFinish){
    	return;
    }
    if (now == (Math.ceil(aLi.length / 4) - 2) * 4) {		// 判断是否还可以再向下翻
      return;
    }

    hasFinish = false;												// 翻页还未完成

    var i = now;
    var timer = setInterval(function() {
      if (i < now + 4) {											//当前第一行
        goMove(aLi[i], { top: -200, opacity: 0 });
      } else if (i < now + 8) {								// 当前第二行
        goMove(aLi[i], { top: 0 });
      } else {																//第三行
        if (i == now + 12) {									
          now += 4;
          hasFinish = true;										//翻页完成
          clearInterval(timer);
        } else {
          goMove(aLi[i], { top: 200, opacity: 100 });
        }
      }
      i++;
    }, 50);
  }

  prev.onclick = function() {
    if (now == 0) {
      return;
    }
  	if(!hasFinish){
    	return;
    }
    hasFinish = false;  
    var i = now + 8 - 1;
    var timer = setInterval(function() {
      if (i >= now + 4) {										//第三行
        goMove(aLi[i], { top: 400, opacity: 0 });
      } else if (i >= now) {								//第二行
        goMove(aLi[i], { top: 200 });
      } else {															//第一行
        if (i >= now - 4) {									
          goMove(aLi[i], { top: 0, opacity: 100 });
        } else {
          now -= 4;
          hasFinish = true;
          clearInterval(timer);
        }
      }
      i--;
    }, 50)
  }

  for (var i = 0; i < aLi.length; i++) {
    aLi[i].onclick = function() {           //图片点击
      var image = this.children[0];
      image.style.transform = 'scale(2,2)';
      image.style.opacity = 1;
      image.style.filter = 'alpha(opacity:100)';
      this.style.zIndex = 1;
    }
    aLi[i].onmouseout = function() {         //移出图片
      var image = this.children[0];
      var nowLi = this;
      setTimeout(function() {
        image.style.transform = '';
        image.style.opacity = 0.7;
        image.style.filter = 'alpha(opacity:70)';
        nowLi.style.zIndex = 0;
      }, 500)
    }
    aLi[i].onmouseover = function() {				//移入图片
      var image = this.children[0];
      image.style.opacity = 1;
      image.style.filter = 'alpha(opacity:100)';
    }
  }

  document.onmousemove = function(ev) {     //侧栏的图片随鼠标移动
    var oEvent = ev || event;

    var move = oEvent.clientX - document.documentElement.clientWidth / 2;
    var moveY = oEvent.clientY - document.documentElement.clientHeight / 2;
    if (move > 0 && moveY < 0) {
      oImg.style.transform = 'translate(50px,-50px)';
    } else if (move > 0 && moveY > 0) {
      oImg.style.transform = 'translate(50px,50px)';
    } else if (move < 0 && moveY < 0) {
      oImg.style.transform = 'translate(-50px,-50px)';
    } else {
      oImg.style.transform = 'translate(-50px,50px)';
    }
  }

  var oMenu = document.getElementById('menu')			//菜单
  var oBg = getByClass(oMenu,'menuIcon')[0];			//菜单按钮
  var aLine = oBg.getElementsByTagName('div');
  var aChoice = getByClass(oMenu,'choice');				//菜单选项
  var color = 'origin';														//记录菜单按钮的颜色

  oBg.onmouseover = function() {
    if (color != 'click') {
      oBg.style.background = '#23BD98';
    } else {
      this.style.background = '#EE78D4';
    }
    oBg.style.boxShadow = '0px 0px 10px #7E7E7E';
  }
  oBg.onmouseout = function() {
    if (color != 'click') {
      oBg.style.background = '#6767E9';
    } else {
      this.style.background = '#E76666';
    }
    oBg.style.boxShadow = '';
    oBg.style.transform = '';
  }

  oBg.onmousedown = function() {
    if (color != 'click') {
      color = 'click';
      aLine[0].style.transform = 'translateY(12px) rotate(45deg) ';
      aLine[1].style.transform = 'translateY(-12px) rotate(-45deg)';
      oBg.style.background = '#E76666';
      oBg.style.transform = 'scale(0.8,0.8)';

    } else {
      color = 'origin';
      aLine[0].style.transform = '';
      aLine[1].style.transform = '';
      oBg.style.transform = 'scale(0.8,0.8)';
    }
  }
  oBg.onmouseup = function() {
    if (color == 'origin') {
      oBg.style.background = '#23BD98';

	    for(var i=0;i<aChoice.length;i++){
	    	goMove(aChoice[i],{bottom:0,opacity: 0});
	    }
    }else{
    	var distance = 0;
	    for(var i=0;i<aChoice.length;i++){
	    	distance+=110;
	    	goMove(aChoice[i],{bottom:distance,opacity: 100});
	    }
    }
    oBg.style.transform = '';    
  }

  for(var i = 0;i<aChoice.length;i++){
  	aChoice[i].index = i;
  	aChoice[i].onclick = function(){         //菜单选项点击事件，切换图片
  		var index = this.index;

  		var oldPath = aLi[0].firstChild.getAttribute('src');
  		for (var i = 0; i<aChoice.length; i++) {
 				aChoice[i].style.boxShadow='';
  		} 		
  		this.style.boxShadow = '0px 0px 20px #5F5F5F';
			if(oldPath.includes(path[index])){
				return;
			}else{
				changeImg(this,path[index]);
			} 		
  	}
  }

  /*改变图片*/
  function changeImg(choice,path){
  	var theme = leftSide.getElementsByTagName('h2')[0];
  	theme.style.transform = 'translateX(300px)';
		imgBox.style.transform = 'scale(0.1,0.1) rotateY(180deg)';
		var source;
    setTimeout(function() {
      for (var i = 0; i < aLi.length; i++) {
        var img = aLi[i].children[0];
        source = path+(i+1)+'.jpg';
        img.setAttribute('src', source);
      }
      imgBox.style.transform = 'rotateY(0)';     
  		theme.innerHTML = choice.getAttribute('title');
  		theme.style.transform = 'translateX(0px)';
    }, 1000)
	}
}


