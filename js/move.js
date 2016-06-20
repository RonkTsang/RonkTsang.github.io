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


//startMove(oDiv, {width: 400, height: 400})


function startMove(obj, json, fnEnd)
{
	clearInterval(obj.timer);
	obj.timer=setInterval(function (){
		var bStop=true;		//多值的情况，先假设所有值都已经变化完了
		
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
				bStop=false;																							// 如果还没变化完，计时器不关闭
			
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
		
		if(bStop)
		{
			clearInterval(obj.timer);
						
			if(fnEnd)fnEnd();																						// 如果链式运动
		}
	}, 30);
}