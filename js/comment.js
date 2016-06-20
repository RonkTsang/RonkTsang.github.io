/*获取样式*/
function getStyle(obj, name) {
  if (obj.currentStyle) {
    return obj.currentStyle[name];
  } else {
    return getComputedStyle(obj, false)[name];
  }
}

/*让物体开始运动*/
/*obj：			运动物体*/
/*json：    更改属性的组合*/
/*nextMove：下一个运动*/
function startMove(obj, json, nextMove) {
  clearInterval(obj.timer);
  obj.timer = setInterval(function() { // 在多物体运动时，每个物体各有计时器
    var hasStop = true; //多值的情况，先假设所有值都已经变化完了

    for (var attr in json) {
      var cur = 0;

      if (attr == 'opacity') //如果要更改的属性是 透明度 的情况
      {
        cur = Math.round(parseFloat(getStyle(obj, attr)) * 100); // 原来的透明度 再四舍五入
      } else {
        cur = parseInt(getStyle(obj, attr));
      }

      var speed = (json[attr] - cur) / 6; // 缓冲直至到达属性到达点
      speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed); // 取整

      if (cur != json[attr])
        hasStop = false; // 如果还没变化完，计时器不关闭

      if (attr == 'opacity') {
        obj.style.filter = 'alpha(opacity:' + (cur + speed) + ')';
        obj.style.opacity = (cur + speed) / 100;
      } else {
        obj.style[attr] = cur + speed + 'px';
      }
    }

    if (hasStop) {
      clearInterval(obj.timer);
      if (nextMove) nextMove(); // 用于做链式运动
    }
  }, 30);
}

/*返回当前日期*/
function nowTime(){
	var date = new Date();
	var month = date.getMonth()+1;
	month = month<10?('0'+month):month;
	var day = date.getDate();
	day = day<10?('0'+day):day; 
	var hour = date.getHours();
	hour=hour<10?('0'+hour):hour;
	var min = date.getMinutes();
	min = min<10?('0'+min):min;

	return month+'-'+day+' '+hour+':'+min;
}

/*新的留言*/
/*text ： 留言内容*/
/*time ： 留言时间*/
function newSay(text,time) {
  return '<time>'+time+'</time>'+'<p>' + text + '</p><br>'+
  			'<input type="text" class="replyText" placeholder="comment">'+
  			'<input type="button" value="reply" class="replyBtn">'+
  			'<input type="button" value="X" class="del">'+
  			'<ul class="replyUl"></ul>';
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

/*判断输入是否为空*/
function isEmpty(string){
	return string.trim().length == 0 ;
}

/*删除父级元素*/
function delParent(son){
	var parent = son.parentNode;
	parent.style.marginBottom = parent.style.marginTop = '0';
	parent.style.paddingBottom = parent.style.paddingTop = '0';
	/*startMove(parent,{height:0,opacity:0})
	setTimeout(function(){
		parent.parentNode.removeChild(parent);
	},550)*/
	startMove(parent,{height:0,opacity:0},function(){
		parent.parentNode.removeChild(parent);
	})
}

/*增加首个子级元素*/
/*oParent ：父级元素*/
/*oSon ： 要添加的子级*/
function addFirstChild(oParent,oSon){
	if (oParent.children.length > 0) {
     oParent.insertBefore(oSon, oParent.children[0]);
  } else {
    oParent.appendChild(oSon);
  }
}

window.onload = function() {
  var newText = document.getElementById('newComment');
  var subBtn = document.getElementById('subBtn');
  var commentUl = document.getElementById('commentUl');
  var egDel = document.getElementById('egDel');

  egDel.onclick = function(){             // 删除例示
  	delParent(this);
  }

  subBtn.onclick = function() {						// 提交按钮点击事件
    var li = document.createElement('li');
    li.className = 'commentLi';
    if (isEmpty(newText.value)) {					// 判断输入是否为空
    	alert('Nothing you have said');
      return ;
    }
    li.innerHTML = newSay(newText.value,nowTime());		//给新增li中添加内容

    addFirstChild(commentUl,li);											//加入新增的li

    var liHeight = li.offsetHeight;
    li.style.height = '0';
		startMove(li,{height:liHeight,opacity:100});

    var del = getByClass(li,'del')[0];								//获取li中的删除按钮
    del.onclick = function(){
    	delParent(this);
    }
		
    var replyBtn = getByClass(li,'replyBtn')[0];			// 获取回复按钮
    var oriHeight = liHeight-5;												// 留言Li的原始高度
    var nowHeight = oriHeight;												// 留言li现在的高度

    replyBtn.onclick = function(){
    	var replyText = getByClass(li,'replyText')[0]; 
  		var reply = replyText.value;										// 回复框的内容
    	if(isEmpty(reply)){
    		alert('Nothing you have said');
    		return ;
    	}
    	li.style.overflowY = 'auto';
    	li.style.overflowX = 'hidden';
   		var replyUl = li.getElementsByTagName('ul')[0];  
   		var replyLi = document.createElement('li');     // 新建放回复的li
   		
   		replyLi.className = 'reply';
   		replyLi.innerHTML = reply +'<input type="button" value="X" class="del">';
   		addFirstChild(replyUl,replyLi);
   		var replyHeight = replyLi.offsetHeight;
    	replyLi.style.height = '0';
    	replyLi.style.opacity = '0';
			startMove(replyLi,{height:replyHeight,opacity:100});

   		nowHeight = nowHeight+replyHeight;    //更新留言li的高度
   		startMove(li,{height:nowHeight});
   		var maxHeight = parseInt(getStyle(li,'maxHeight'));
   		var delReply = getByClass(replyLi,'del')[0];    // 获得删除回复的按钮

   		delReply.onclick = function(){
   			delParent(this);
   			var ulHeight = replyUl.offsetHeight-replyLi.offsetHeight; //回复区域的高度
   			
   			if(ulHeight<=(maxHeight-oriHeight)){           //回复区没溢出的情况
   				if(replyUl.children.length==1){
	   				nowHeight = oriHeight;
	   				startMove(li,{height:oriHeight});
	   			}else{																			
		   			nowHeight = oriHeight+ulHeight;
		   			startMove(li,{height:nowHeight});			
	   			}
   			}   			
   		}
    }
  }
}

