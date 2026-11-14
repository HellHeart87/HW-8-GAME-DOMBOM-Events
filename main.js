'use strict';
(()=>{
 const $=id=>document.getElementById(id),game=new Game($('field'));
 for(let n=1;n<=CONFIG.MAX_SPEED;n++){const l=document.createElement('label');l.innerHTML=`<input type="radio" name="speed" value="${n}" ${n===1?'checked':''}><span>${n}</span>`;$('speeds').appendChild(l);}
 let best=0;try{const n=Number(localStorage.getItem('squareInvadersBest'));best=Number.isFinite(n)&&n>0?n:0;}catch(_){}$('best').textContent=best;
 const overlay=(title,text)=>{$('overlayTitle').textContent=title;$('overlayText').textContent=text;$('overlay').hidden=false;};
 window.addEventListener('pointerdown',()=>soundFX.resume(),{capture:true});window.addEventListener('keydown',()=>soundFX.resume(),{capture:true});
 $('startForm').addEventListener('submit',e=>{e.preventDefault();$('error').hidden=true;try{game.start(document.querySelector('input[name="speed"]:checked')?.value);document.activeElement?.blur();}catch(err){if(!(err instanceof GameError))throw err;$('error').textContent=err.message;$('error').hidden=false;}});
 $('pauseBtn').onclick=()=>{game.togglePause();$('pauseBtn').blur();};
 $('soundBtn').onclick=()=>{soundFX.enabled=!soundFX.enabled;$('soundBtn').setAttribute('aria-pressed',String(soundFX.enabled));$('soundBtn').textContent=soundFX.enabled?'Звук: увімкнено':'Звук: вимкнено';$('soundBtn').blur();};
 game.addEventListener('start',()=>{$('overlay').hidden=true;$('startBtn').textContent='Почати знову';});
 game.addEventListener('score',e=>{for(const [id,key] of [['score','score'],['kills','kills'],['speedNow','speed']])$(id).textContent=e.detail[key];});
 game.addEventListener('levelup',()=>{$('speedNow').classList.remove('flash');void $('speedNow').offsetWidth;$('speedNow').classList.add('flash');});
 game.addEventListener('pause',e=>{if(e.detail.paused)overlay('Пауза','Натисніть P або кнопку продовження.');else $('overlay').hidden=true;});
 game.addEventListener('gameover',e=>{if(e.detail.score>best){best=e.detail.score;$('best').textContent=best;try{localStorage.setItem('squareInvadersBest',String(best));}catch(_){}}overlay('Кінець гри',`Очки: ${e.detail.score}. Збито: ${e.detail.kills}.`);});
 const actions={ArrowLeft:()=>game.move(-1),KeyA:()=>game.move(-1),ArrowRight:()=>game.move(1),KeyD:()=>game.move(1),Space:()=>game.fire(),KeyP:()=>game.togglePause()};
 document.addEventListener('keydown',e=>{if(e.target instanceof Element&&e.target.matches('input,button,textarea,select,[contenteditable]'))return;const action=actions[e.code];if(!action)return;e.preventDefault();if(e.code==='KeyP'&&e.repeat)return;action();});
 document.querySelectorAll('.touch button').forEach(b=>{let timer;const act={left:()=>game.move(-1),right:()=>game.move(1),fire:()=>game.fire()}[b.dataset.act];const stop=()=>{clearInterval(timer);timer=null;};b.addEventListener('pointerdown',e=>{e.preventDefault();stop();b.setPointerCapture(e.pointerId);act();timer=setInterval(act,b.dataset.act==='fire'?CONFIG.SHOT_COOLDOWN:120);});for(const ev of ['pointerup','pointercancel','lostpointercapture'])b.addEventListener(ev,stop);window.addEventListener('blur',stop);});
 document.addEventListener('visibilitychange',()=>{if(document.hidden&&game.state==='running')game.togglePause();});
})();
