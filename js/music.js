/*通过类名获取元素*/
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

/*转换为带特点位数的小数*/
/*num：		要转换的数字*/
/*digits：位数*/
function toFixedNum(num,digits){
	return parseFloat(num.toFixed(digits));
}

/*返回媒体当前进度时间*/
function curTime(audio){
	return countTime(audio.currentTime);
}

/*返回媒体当前的进度*/
function nowRate(audio){
	var rate=toFixedNum((audio.currentTime/audio.duration)*100,0);
	return rate/100;
}

/*计算时间并转换格式*/
function countTime(time){
	var second;
	var min;
	min = parseInt(time/60);
	second = parseInt(time%60);
	min = min<10?("0"+min):(min);
	second = second<10?('0'+second):second;
	return min+':'+second;
}

window.onload = function(){
	var aAudio = document.getElementsByTagName('audio');

	var volumeCtrl = document.getElementById('volumeCtrl');

	var playList = document.getElementById('playList');
	var ulList = playList.getElementsByTagName('ul')[0];
	var player = document.getElementById('player');
	var main = document.getElementById('main');
	var albumBg = document.getElementById('background');
	var volExtr = document.getElementById('volExtr'); 
	var listExtr = document.getElementById('listExtr');
	var listLine = listExtr.getElementsByTagName('div');
	var songName = document.getElementById('songName');
	var albumImg = main.getElementsByTagName('img')[0];

	function changeImg(title){                      //更新专辑图片
		while(title.indexOf(' ')!=-1){								//去掉歌名中的空格
			title=title.replace(" ","");
		}
		albumImg.src = 'images/album/'+title+'.jpg';
		albumBg.style.backgroundImage = 'url(images/album/'+title+'.jpg)';
		albumBg.style.opacity = albumImg.style.opacity='0.7';
		setTimeout(function(){
			albumBg.style.opacity = albumImg.style.opacity='1';
		},500)
	}

	for(var i=0;i<aAudio.length;i++){							//创建播放列表
		aAudio[i].index = i;
		var li = document.createElement('li');
		li.textLong = aAudio[i].title.length;
		li.innerHTML = '<p>'+aAudio[i].title+'</p>';
		ulList.appendChild(li);
	}

	var hasVolExtr = false;												//是否打开的音量控制入口
	volExtr.onclick = function(){
		if(!hasVolExtr){
			this.style.color = '#FF6244';
			volumeCtrl.style.top = '-50px';
			hasVolExtr = true;
		}else{
			this.style.color = 'white';
			volumeCtrl.style.top = '10px';
			hasVolExtr = false;
		}
	}


	var hasListExtr = false;										//是否打开列表入口
	listExtr.onclick = function(){
		if(!hasListExtr){
			playList.style.transform = 'translateX(100px)';
			main.style.left = '-100px';
			for(var i=0;i<listLine.length;i++){
				listLine[i].style.backgroundColor = '#FF6244';
			}
			listLine[1].style.transform = 'rotate(-45deg) translate(-8px,12px) scaleX(0.7)';
			listLine[2].style.transform = 'rotate(45deg) translate(-8px,-12px) scaleX(0.7)';
			hasListExtr = true;
		}else{
			listLine[1].style.transform = listLine[2].style.transform = '';
			main.style.left = playList.style.transform ='';
			for(var i=0;i<listLine.length;i++){
				listLine[i].style.backgroundColor = 'white';
			}
			hasListExtr = false;
		}	
	}

	var fullVolume = volumeCtrl.children[0];	  //获取音量控制条
	var showVol = fullVolume.children[0];				// 显示音量
	var volPicker = fullVolume.children[1];			//调节音量滑块

	var duration = document.getElementById('duration');   //进度条
	var progress = duration.children[0];									//显示进度条
	var showDur = duration.children[1];										//显示进度时间
	var durPicker = duration.children[2];									//调节进度滑块
	var nowTime = document.getElementById('nowTime');			//当前进度时间
	var fullTime = document.getElementById('fullTime');		//歌曲中长度

	var oAudio = aAudio[1];																//初始设置
	oAudio.volume = 0.5;
	songPlay(oAudio);
	changeImg(oAudio.title);
	var nowVolume = 0.5;
	showVol.innerText = 50;
	fullTime.innerText = countTime(oAudio.duration);
	songName.innerText = oAudio.title;
	var nowSong = 1;																			//记录当前歌曲序号

	var timer;												//更新当前播放时间的计时器
	var timer1;												// 更新进度的计时器
	var volTimer;											// 延迟 音量显示 消失的计时器

	volPicker.onmousedown = function(ev){										 //通过滑块调节
		clearTimeout(volTimer);
		var oEvent = ev||event;
		var disX = oEvent.clientX - volPicker.offsetLeft;      //记录滑块与鼠标的间隔
		showVol.style.display = 'block';

		document.onmousemove = function(ev){
			var oEvent = ev||event;
			var long = oEvent.clientX - disX;                   // 滑块位置
			var maxLong = fullVolume.offsetWidth - volPicker.offsetWidth;  //滑块最大的位置
			if(long<0){
				long=0;
			}
			if(long>maxLong){
				long = maxLong;
			}
			showVol.style.left=volPicker.style.left=long+'px';
			showVol.innerText = Math.ceil(long/6);
			nowVolume = oAudio.volume = Math.ceil(long/6)/100;
		}

		document.onmouseup = function(){
			showVol.style.display = 'none';
			document.onmousemove = null;
			document.onmouseup = null;
		}
	}

	fullVolume.onclick = function(ev){										//通过点击调节音量
		clearTimeout(volTimer);
		var oEvent = ev||event;
		var long = oEvent.clientX - this.offsetLeft - player.offsetLeft;
		var maxLong = this.offsetWidth-volPicker.offsetWidth
		if(long>maxLong){
			long=maxLong;
		}
		showVol.style.left = volPicker.style.left = long+'px';
		showVol.innerText = Math.ceil(long/6);
		nowVolume = oAudio.volume = Math.ceil(long/6)/100;
		showVol.style.display = 'block';
		volTimer = setTimeout(function(){
			showVol.style.display = 'none';
		},1000);
	}

	var Durtimer;																					// 延迟 音量显示 消失的计时器

	durPicker.onmousedown = function(ev){									// 通过滑块调节进度
		clearTimeout(Durtimer);
		clearInterval(timer1);
		var nowPlayTime = 0.001;
		var oEvent = ev||event;
		var disX = oEvent.clientX - this.offsetLeft;
		var maxLong = duration.offsetWidth - this.offsetWidth;
		showDur.style.display = 'block';

		document.onmousemove = function(ev){
			var oEvent = ev||event;
			var long = oEvent.clientX - disX;
			if(long<0){
				long = 0;
			}
			if(long>maxLong){
				long = maxLong;
			}
			durPicker.style.left=showDur.style.left=progress.style.width=long+'px';
			nowPlayTime = (long/maxLong)*oAudio.duration;
			showDur.innerText = countTime(nowPlayTime);
		}

		document.onmouseup = function(){
			oAudio.currentTime = toFixedNum(nowPlayTime,2);
			durTimer = setTimeout(function(){
				showDur.style.display = 'none';
			},500)
			document.onmousemove = null;
			document.onmouseup = null;
		}
	}

	duration.onclick = function(ev){           // 通过点击调节进度
		var nowPlayTime = 0.001;
		clearTimeout(Durtimer);
		clearInterval(timer1);
		var oEvent = ev||event;
		var long = oEvent.clientX - this.offsetLeft - (player.offsetLeft+main.offsetLeft);
						// player 和 main 的offsetLeft 相加用于 播放列表打开时校准位置
		var maxLong = duration.offsetWidth - durPicker.offsetWidth;
		if(long>maxLong){
			long = maxLong;
		}
		durPicker.style.left=showDur.style.left=progress.style.width=long+'px';
		nowPlayTime = (long/maxLong)*oAudio.duration;
		showDur.innerText = countTime(nowPlayTime);
		oAudio.currentTime = toFixedNum(nowPlayTime,2);
		showDur.style.display = 'block';
		durTimer = setTimeout(function(){
			showDur.style.display = 'none';
		},500)
	}

	/*媒体播放过程*/
	function songPlay(oAudio)
	{
		oAudio.onplaying = function(){                     		 //媒体正在播放时
			aLi[oAudio.index].style.color = '#EB6C6C';					//列表突出当前媒体
			albumImg.style.animationPlayState = 'running';
			clearInterval(timer);
			timer = setInterval(function(){                     //更新当前播放时间
				nowTime.innerText = curTime(oAudio);
			},500);

			timer1 = setInterval(function(){										//更新进度
				showDur.innerText = curTime(oAudio);
				progress.style.width = showDur.style.left = durPicker.style.left = 600*nowRate(oAudio)+'px';
			},500);
		}

		oAudio.onpause = function(){													//媒体暂停播放时
			albumImg.style.animationPlayState = 'paused';
			clearInterval(timer1);
			clearInterval(timer);
		}

		oAudio.onended = function(){													//媒体播放结束
			clearInterval(timer);
			clearInterval(timer1);
			showDur.innerText = '00:00';
			progress.style.width = showDur.style.left = durPicker.style.left = 0+'px';
			nowTime.innerText = '00:00';
			changeSong('next');
		}
	}

	/*停止播放媒体*/
	function stopPlay(oAudio){
		albumImg.style.animationPlayState = 'paused';
		oAudio.load();
		pausePlaying();
		clearInterval(timer);
		clearInterval(timer1);
		showDur.innerText = '00:00';
		progress.style.width = showDur.style.left = durPicker.style.left = '0px';
	}

	/*切换媒体*/
	function changeSong(prevOrNext){
		var isContinue = false;											// 是否接着继续播放
		aLi[oAudio.index].style.color = 'inherit';
		albumImg.style.animationPlayState = 'paused';

		if(prevOrNext === 'prev'){										//上一首
			if(!oAudio.paused){
				stopPlay(oAudio);
				isContinue = true;
			}else{
				oAudio.currentTime = 0;
			}
			nowSong--;
			if(nowSong<0){
				nowSong = aAudio.length-1;
			}
			oAudio = aAudio[nowSong];
			changeImg(oAudio.title);
			if(isContinue){
				oAudio.play();
				startPlay();
			}
			oAudio.volume = nowVolume;
			songPlay(oAudio);
			songName.innerText = oAudio.title;
			fullTime.innerText = countTime(oAudio.duration);

		}else if(prevOrNext === 'next'){							//下一首
			if(oAudio.ended){
				isContinue = true;
			}else if(!oAudio.paused){
				stopPlay(oAudio);
				isContinue = true;
			}else{
				oAudio.currentTime = 0;
				isContinue = false;
			}
			nowSong++;
			if(nowSong == aAudio.length){
				nowSong = 0;
			}
			oAudio = aAudio[nowSong];

			changeImg(oAudio.title);
			if(isContinue){
				oAudio.play();
				startPlay();
			}
			oAudio.volume = nowVolume;
			songPlay(oAudio);
			songName.innerText = oAudio.title;
			fullTime.innerText = countTime(oAudio.duration);
		}
	}

	var ctrlBtn = document.getElementById('ctrlBtn');     //播放控制按钮
	var line1 = ctrlBtn.children[0];
	var line2 = ctrlBtn.children[1];
	var line3 = ctrlBtn.children[2];
	var next = document.getElementById('next');						//下一首按钮
	var prev = document.getElementById('prev');						//上一首按钮

	var isPlay = false;																		//是否正在播放

	prev.onmousedown = next.onmousedown = function(){			//切换触发
		this.style.boxShadow = '0px 0px 5px #8E062B';
		this.style.transform = 'scale(0.9,0.9)';
		var dist = -5;
		if(this.getAttribute('id')=='next'){
			dist = -dist;
		}
		this.firstChild.style.transform = 'translateX('+dist+'px) scaleY(0.8)';
	}

	prev.onmouseup = next.onmouseup = function(){
		this.style.boxShadow='';
		this.style.transform = this.firstChild.style.transform = '';
		changeSong(this.id);
	}

	prev.onmouseout = next.onmouseout = function(){
		this.style.boxShadow='';
		this.style.transform = this.firstChild.style.transform = '';
	}

	//songPlay(oAudio);
	ctrlBtn.onmousedown = function(){											// 播放控制
		var hasClickUp = false;															// 鼠标按下后是否在按钮区域抬起
		this.style.boxShadow = '0px 0px 15px #8E062B';
		this.style.transform = 'scale(0.9,0.9)';
		var pushTime = 0;																		//记录按压时间
		var timer2 = setInterval(function(){
			pushTime+=0.1;
			if(pushTime>0.7){
				clearInterval(timer2);
				stopPlay(oAudio);																//若长按按钮停止播放
				return;
			}
		},100);

		ctrlBtn.onmouseup = function(){
			this.style.transform = this.style.boxShadow = '';
			clearInterval(timer2);
			if(pushTime>0.7)return;
			if(!isPlay){
				startPlay();
				oAudio.play();
			}else{
				pausePlaying();
				oAudio.pause();
			}
			hasClickUp = true;
		}

		ctrlBtn.onmouseout = function(){

			if(!hasClickUp){
				clearInterval(timer2);
				if(pushTime>0.7){
					return;
				}
				this.style.transform = this.style.boxShadow = '';
				if(!isPlay){
					pausePlaying();
				}else{
					startPlay();
				}
			}
			hasClickUp = true;
		}
	}

	/*暂停播放时按钮变化*/
	function pausePlaying(){
		line2.style.transform = 'rotate(-60deg)';
		line3.style.transform = 'rotate(60deg)';
		isPlay = false;
	}

	/*开始播放时按钮变化*/
	function startPlay(){
		line2.style.transform = 'rotate(0) translate(10px,10px)';
		line3.style.transform = 'rotate(0) translate(10px,-10px)';
		isPlay = true;
	}


	var aLi = ulList.getElementsByTagName('li');				//获取播放列表中每一项
	for(var i=0;i<aLi.length;i++){
		aLi[i].index = i;
		aLi[i].onmouseover = function(){									//鼠标滑过列表显示全名
			clearTimeout(this.timer);
			if(this.index == 0){
				this.textLong = this.children[0].innerText.length;
				console.log(this.textLong);
			}
			var nowLi = this.children[0];
			if(this.textLong*10>180){	           // 判断歌名是否超过
				nowLi.style.transition = '1.5s';			
				nowLi.style.left='-'+(this.textLong*10-150)+'px';
				// nowLi.style.right = 0;
				// nowLi.style.right = (this.textLong*10)+'px';
				this.timer = setTimeout(function(){
					nowLi.style.left='0px';
				},2000)
			}else{
				nowLi.style.left = '-15px';
				console.log(this.textLong);
				this.timer = setTimeout(function(){
					nowLi.style.left='0px';
				},1100)
			}
		}
		aLi[i].onclick = function(){										//通过列表切换媒体

			if(this.index == oAudio.index){								//若选择了当前正在播放的媒体
				if(isPlay){
					pausePlaying();
					oAudio.pause();
				}else{
					startPlay();
					oAudio.play();
				}
			}else{
				for(var i=0;i<aLi.length;i++){
					if(i==this.index){
						aLi[oAudio.index].style.color = 'inherit';  // 将上一首在列表样式切回原状
						stopPlay(oAudio);
						oAudio = aAudio[i];
						nowSong = i;
						changeImg(oAudio.title);
						oAudio.volume = nowVolume;
						songPlay(oAudio);
						songName.innerText = oAudio.title;
						fullTime.innerText = countTime(oAudio.duration);
						startPlay();
						oAudio.play();
					}
				}
			}			
		}
	}

	document.onkeydown = function(ev){							//键盘控制播放
		var oEvent = ev||event;
		var key = oEvent.keyCode;
		document.onkeyup = function(){
			if(key==13||key == 32){
				if(isPlay){
					oAudio.pause();
					pausePlaying();
				}else{
					oAudio.play();
					startPlay();
				}
				return false;
			}else if(key == 37){
				changeSong('prev');
			}else if(key == 39){
				changeSong('next');
			}
		}
	}
}