(function()
{
  'use strict';
  var root=document.getElementById('ms-app');if(!root)return;
  var $=function(q,el)
  {
    return(el||root).querySelector(q)
  }
  ;
  var all=function(q,el)
  {
    return Array.prototype.slice.call((el||root).querySelectorAll(q))
  }
  ;
  var reduced=!!(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var audio=$('#mahalaya-audio');var radio=$('#radio-shell');var power=$('#power-button');var replay=$('#replay-button');var mute=$('#mute-button');var muteIcon=$('#mute-icon');var vol=$('#volume-range');var seek=$('#seek-range');var cur=$('#time-current');var total=$('#time-total');var progress=$('#read-progress');var toast=$('#toast');
  var messageTimer=0;function tell(s)
  {
    if(!toast)return;toast.textContent=s;toast.classList.add('show');clearTimeout(messageTimer);messageTimer=setTimeout(function()
    {
      toast.classList.remove('show')
    }
    ,3100)
  }
  function buzz(ms)
  {
    try
    {
      if(navigator.vibrate)navigator.vibrate(ms||12)
    }
    catch(e)
    {
    }
  }
  function press(el)
  {
    if(!el)return;el.classList.add('pushed');setTimeout(function()
    {
      el.classList.remove('pushed')
    }
    ,230)
  }
  function smoothTo(el)
  {
    if(!el)return;root.scrollTo(
    {
      top:root.scrollTop+el.getBoundingClientRect().top-root.getBoundingClientRect().top-84,behavior:reduced?'auto':'smooth'
    }
    )
  }
  all('[data-go]').forEach(function(btn)
  {
    btn.addEventListener('click',function(e)
    {
      e.preventDefault();press(btn);buzz(12);smoothTo(document.getElementById(btn.dataset.go))
    }
    )
  }
  );
  var brand=$('.brand');if(brand)brand.addEventListener('click',function(e)
  {
    e.preventDefault();smoothTo($('#home'))
  }
  );
  function updateScroll()
  {
    var max=Math.max(1,root.scrollHeight-root.clientHeight);progress.style.width=Math.max(0,Math.min(100,(root.scrollTop/max)*100)).toFixed(2)+'%';if(!reduced)
    {
      var hero=$('#art-orbit');if(hero)
      {
        var y=$('#home').getBoundingClientRect().top-root.getBoundingClientRect().top;var v=Math.max(-1,Math.min(1,y/800));hero.style.transform='translateY('+(v*20).toFixed(1)+'px) rotate('+(v*-4).toFixed(1)+'deg)'
      }
    }
  }
  var scrollQueued=false;root.addEventListener('scroll',function()
  {
    if(scrollQueued)return;scrollQueued=true;requestAnimationFrame(function()
    {
      scrollQueued=false;updateScroll();updateScene()
    }
    )
  }
  ,
  {
    passive:true
  }
  );updateScroll();
  // Scroll-triggered typography & paper-card animation, scoped to the embed scroll frame.
  root.classList.add('js-on');
  var rev=all('.reveal,.headline-words');
  if('IntersectionObserver' in window)
  {
    var revObs=new IntersectionObserver(function(items)
    {
      items.forEach(function(x)
      {
        if(x.isIntersecting)
        {
          x.target.classList.add('in-view');revObs.unobserve(x.target)
        }
      }
      )
    }
    ,
    {
      root:root,threshold:.1,rootMargin:'0px 0px -35px 0px'
    }
    );rev.forEach(function(el)
    {
      revObs.observe(el)
    }
    )
  }
  else
  {
    rev.forEach(function(el)
    {
      el.classList.add('in-view')
    }
    )
  }
  // Story changes every time the next card reaches the focus band.
  var steps=all('.story-step');var scenes=all('.scene');var count=$('#scene-count');var activeScene=-1;
  function setScene(index)
  {
    index=Math.max(0,Math.min(steps.length-1,index));if(activeScene===index)return;activeScene=index;steps.forEach(function(e,i)
    {
      e.classList.toggle('active',i===index)
    }
    );scenes.forEach(function(e,i)
    {
      e.classList.toggle('active',i===index)
    }
    );count.textContent=String(index+1).padStart(2,'0')
  }
  function updateScene()
  {
    var focus=root.getBoundingClientRect().top+root.clientHeight*.61;var choice=0;var min=Infinity;steps.forEach(function(step,i)
    {
      var box=step.getBoundingClientRect(),middle=box.top+Math.min(box.height*.45,240);var delta=Math.abs(middle-focus);if(delta<min)
      {
        choice=i;min=delta
      }
    }
    );setScene(choice)
  }
  setScene(0);requestAnimationFrame(updateScene);
  // The radio starts only after a click or tap (required by browser autoplay rules).
  function timeFormat(s)
  {
    if(!isFinite(s)||s<0)return'0:00';var n=Math.floor(s);return Math.floor(n/60)+':'+String(n%60).padStart(2,'0')
  }
  function syncAudio()
  {
    var isPlaying=!audio.paused;radio.classList.toggle('playing',isPlaying);power.classList.toggle('on',isPlaying);power.setAttribute('aria-pressed',String(isPlaying));power.setAttribute('aria-label',isPlaying?'রেডিও বন্ধ করুন':'রেডিও চালু করুন');var dur=isFinite(audio.duration)?audio.duration:35;cur.textContent=timeFormat(audio.currentTime);total.textContent=timeFormat(dur);if(dur>0)
    {
      seek.value=((audio.currentTime/dur)*100).toFixed(2)
    }
    var nd=$('#freq-needle');if(nd)nd.style.left=(33+Math.min(43,(audio.currentTime/dur)*43))+'%'
  }
  power.addEventListener('click',function()
  {
    buzz(20);if(audio.paused)
    {
      var promise=audio.play();if(promise&&promise.catch)promise.catch(function()
      {
        tell('অডিও চালু হয়নি। আবার সুইচ টিপুন।')
      }
      )
    }
    else
    {
      audio.pause()
    }
    syncAudio()
  }
  );
  replay.addEventListener('click',function()
  {
    buzz(10);audio.currentTime=0;var p=audio.play();if(p&&p.catch)p.catch(function()
    {
      tell('অডিও চালাতে সুইচটি টিপুন')
    }
    );syncAudio()
  }
  );
  mute.addEventListener('click',function()
  {
    buzz(12);audio.muted=!audio.muted;mute.setAttribute('aria-pressed',String(audio.muted));mute.setAttribute('aria-label',audio.muted?'শব্দ চালু করুন':'শব্দ বন্ধ করুন');if(muteIcon)muteIcon.setAttribute('href',audio.muted?'#ico-mute':'#ico-sound')
  }
  );
  vol.addEventListener('input',function()
  {
    audio.volume=Number(vol.value)/100;if(audio.volume>0&&audio.muted)
    {
      audio.muted=false;mute.setAttribute('aria-pressed','false');if(muteIcon)muteIcon.setAttribute('href','#ico-sound')
    }
  }
  );
  seek.addEventListener('input',function()
  {
    if(isFinite(audio.duration)&&audio.duration>0)
    {
      audio.currentTime=audio.duration*Number(seek.value)/100;syncAudio()
    }
  }
  );
  ['timeupdate','loadedmetadata','durationchange','play','pause','ended'].forEach(function(ev)
  {
    audio.addEventListener(ev,syncAudio)
  }
  );audio.addEventListener('error',function()
  {
    tell('অডিও লোড করতে সমস্যা হচ্ছে।')
  }
  );audio.volume=.68;syncAudio();
  // Animated folio turns: each click initiates visible 3D flip, then updates both pages.
  var chapters=[
  {
    title:'সেই রেডিও',text:'বাড়ির কোণে একটা পুরোনো রেডিও। ঘুমচোখে তার পাশে বসেই শুরু হত আমাদের মহালয়ার সকাল।',kicker:'CHAPTER / ০১',num:'স্মৃতির পাতা · ০১',art:'lotus'
  }
  ,
  {
    title:'শিউলি ঝরা ভোর',text:'উঠোনে মুঠো মুঠো শিউলি পড়ে থাকত। সেই সাদা-কমলা গন্ধেই যেন প্রথম চেনা যেত শরৎকালকে।',kicker:'CHAPTER / ০২',num:'স্মৃতির পাতা · ০২',art:'flower'
  }
  ,
  {
    title:'প্রার্থনার আলো',text:'নদীর ঘাট, প্রথম সূর্যরশ্মি, শান্ত মন্ত্র। ভোরের বাতাসে ভেসে আসত স্মরণ আর শ্রদ্ধার সুর।',kicker:'CHAPTER / ০৩',num:'স্মৃতির পাতা · ০৩',art:'alpana'
  }
  ,
  {
    title:'মা আসছেন',text:'চণ্ডীপাঠ শেষ হলেও মনে থেকে যায় সেই সুর। কারণ মহালয়া মানেই আশা—শুভের আর এক নতুন শুরু।',kicker:'CHAPTER / ০৪',num:'স্মৃতির পাতা · ০৪',art:'lotus'
  }
  ];
  var paper=$('#book-paper'),prev=$('#book-prev'),next=$('#book-next'),pagin=$('#book-pagination'),bookIndex=0,turning=false;
  function bookSymbol(c)
  {
    return c.art==='alpana'?'symbol-alpana':c.art==='flower'?'symbol-flower':'symbol-lotus'
  }
  function paintBook()
  {
    var c=chapters[bookIndex];
    $('#book-title').textContent=c.title;$('#book-text').textContent=c.text;
    $('#book-kicker').textContent=c.kicker;$('#book-number').textContent=c.num;
    pagin.textContent=String(bookIndex+1).padStart(2,'0')+' / '+String(chapters.length).padStart(2,'0');
    prev.disabled=turning||bookIndex===0;next.disabled=turning||bookIndex===chapters.length-1;
    $('#book-art').innerHTML='<svg viewBox="0 0 300 300" aria-hidden="true"><use href="#'+bookSymbol(c)+'"/></svg>';
  }
  function flipText(c)
  {
    return '<span class="flip-kicker">'+c.num+'</span><h3>'+c.title+'</h3><p>'+c.text+'</p>'
  }
  function flipArt(c)
  {
    return '<div class="flip-art"><svg viewBox="0 0 300 300" aria-hidden="true"><use href="#'+bookSymbol(c)+'"/></svg></div><span class="flip-small">'+c.kicker+'</span>'
  }
  function flipMobile(c)
  {
    return '<div class="flip-mobile-sheet"><div class="flip-mobile-art"><svg viewBox="0 0 300 300" aria-hidden="true"><use href="#'+bookSymbol(c)+'"/></svg></div><div class="flip-mobile-copy">'+flipText(c)+'</div></div>'
  }
  var pendingTurnTimer=null;
  function setChapterDecor()
  {
    var e=$('#book-chapter-current'),f=$('#book-chapter-fill');if(e)e.textContent=String(bookIndex+1);if(f)f.style.width=((bookIndex+1)/chapters.length*100)+'%'
  }
  function turnBook(dir)
  {
    if(turning)return;
    var target=bookIndex+dir;
    if(target<0||target>=chapters.length)return;
    buzz(12);
    if(reduced)
    {
      bookIndex=target;paintBook();setChapterDecor();return;
    }
    turning=true;
    prev.disabled=next.disabled=true;
    paper.classList.add('is-turning');
    var oldChapter=chapters[bookIndex],newChapter=chapters[target];
    var mobile=window.matchMedia&&window.matchMedia('(max-width:700px)').matches;
    var leaf=document.createElement('div');
    leaf.className='paper-flip-leaf '+(dir>0?'flip-forward':'flip-backward');
    leaf.setAttribute('aria-hidden','true');
    var front=mobile?flipMobile(oldChapter):(dir>0?flipText(oldChapter):flipArt(oldChapter));
    var back=mobile?flipMobile(newChapter):(dir>0?flipArt(newChapter):flipText(newChapter));
    leaf.innerHTML='<div class="paper-flip-face paper-flip-face--front">'+front+'</div><div class="paper-flip-face paper-flip-face--back">'+back+'</div>';
    paper.appendChild(leaf);
    var finished=false,changed=false;
    function changeChapter()
    {
      if(changed)return;changed=true;bookIndex=target;paintBook();setChapterDecor()
    }
    function finish()
    {
      if(finished)return;finished=true;clearTimeout(pendingTurnTimer);changeChapter();leaf.remove();paper.classList.remove('is-turning');turning=false;paintBook()
    }
    // Change the underlying pages only when the sheet is edge-on.
    var changeTimer=setTimeout(changeChapter,530);
    leaf.addEventListener('animationend',function(e)
    {
      if(e.target===leaf)
      {
        clearTimeout(changeTimer);finish()
      }
    }
    ,
    {
      once:true
    }
    );
    requestAnimationFrame(function()
    {
      requestAnimationFrame(function()
      {
        leaf.classList.add('flipping')
      }
      )
    }
    );
    pendingTurnTimer=setTimeout(function()
    {
      clearTimeout(changeTimer);finish()
    }
    ,1350);
  }
  prev.addEventListener('click',function()
  {
    turnBook(-1)
  }
  );
  next.addEventListener('click',function()
  {
    turnBook(1)
  }
  );
  // Swipe horizontally across the paper on touch devices (ignore mostly vertical scrolling).
  var gesture=null;
  paper.addEventListener('touchstart',function(e)
  {
    if(e.touches.length!==1||turning)return;gesture=
    {
      x:e.touches[0].clientX,y:e.touches[0].clientY,t:Date.now()
    }
  }
  ,
  {
    passive:true
  }
  );
  paper.addEventListener('touchend',function(e)
  {
    if(!gesture||!e.changedTouches.length||turning)
    {
      gesture=null;return
    }
    var dx=e.changedTouches[0].clientX-gesture.x,dy=e.changedTouches[0].clientY-gesture.y;if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)*1.5&&Date.now()-gesture.t<900)turnBook(dx<0?1:-1);gesture=null
  }
  ,
  {
    passive:true
  }
  );
  paper.addEventListener('touchcancel',function()
  {
    gesture=null
  }
  ,
  {
    passive:true
  }
  );
  // Keyboard controls when the book is focused.
  paper.setAttribute('tabindex','0');paper.setAttribute('role','region');paper.setAttribute('aria-label','মহালয়ার স্মৃতির বই, ডানে বা বাঁয়ে তীর ব্যবহার করুন');
  paper.addEventListener('keydown',function(e)
  {
    if(e.key==='ArrowRight'||e.key==='ArrowLeft')
    {
      e.preventDefault();turnBook(e.key==='ArrowRight'?1:-1)
    }
  }
  );
  paintBook();setChapterDecor();
  // Native vibration on supported devices, visible tactile ripple everywhere else.
  all('.ui-icon,.power,.wish-stamp').forEach(function(el)
  {
    el.addEventListener('pointerdown',function(e)
    {
      if(el.disabled)return;
      el.classList.add('tactile-down');
      var r=el.getBoundingClientRect();
      var wave=document.createElement('span');wave.className='tap-ripple';
      wave.style.left=(e.clientX-r.left)+'px';wave.style.top=(e.clientY-r.top)+'px';
      el.appendChild(wave);setTimeout(function()
      {
        wave.remove()
      }
      ,520);
    }
    ,
    {
      passive:true
    }
    );
    ['pointerup','pointercancel','pointerleave'].forEach(function(eventName)
    {
      el.addEventListener(eventName,function()
      {
        el.classList.remove('tactile-down')
      }
      ,
      {
        passive:true
      }
      );
    }
    );
  }
  );
  var wish=$('#wish-button');wish.addEventListener('click',function()
  {
    buzz(25);wish.style.transform='translate(5px,5px) rotate(-12deg)';setTimeout(function()
    {
      wish.style.transform=''
    }
    ,230);var msg='শুভ মহালয়া! শিউলির সুবাস, ভোরের সুর আর দেবীপক্ষের আলোয় ভরে উঠুক প্রতিটি মন। — Subham';$('#wish-message').textContent='শুভ হোক আপনার দেবীপক্ষ!';if(navigator.clipboard&&navigator.clipboard.writeText)
    {
      navigator.clipboard.writeText(msg).then(function()
      {
        tell('শুভেচ্ছাটি কপি হয়েছে')
      }
      ).catch(function()
      {
        tell('শুভ মহালয়া!')
      }
      )
    }
    else
    {
      tell('শুভ মহালয়া!')
    }
  }
  );
  window.addEventListener('resize',function()
  {
    updateScroll();updateScene()
  }
  ,
  {
    passive:true
  }
  );
  // Keep audio from playing after embed gets fully hidden.
  document.addEventListener('visibilitychange',function()
  {
    if(document.hidden&&!audio.paused)audio.pause()
  }
  );
}
)();
