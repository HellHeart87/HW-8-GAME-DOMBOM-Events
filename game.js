'use strict';
class Game extends EventTarget {
 constructor(canvas){super();this.canvas=canvas;this.ctx=canvas.getContext('2d');this.width=CONFIG.COLS*CONFIG.CELL;this.height=CONFIG.ROWS*CONFIG.CELL;const d=window.devicePixelRatio||1;canvas.width=this.width*d;canvas.height=this.height*d;this.ctx.setTransform(d,0,0,d,0,0);this.ctx.imageSmoothingEnabled=false;this.state='idle';this.last=0;this.stars=Array.from({length:65},()=>({x:Math.random()*this.width,y:Math.random()*this.height,v:4+Math.random()*15}));this.reset(1);requestAnimationFrame(t=>this.loop(t));}
 emit(name,detail={}){this.dispatchEvent(new CustomEvent(name,{detail}));}
 reset(speed){this.baseSpeed=speed;this.score=0;this.kills=0;this.level=0;this.player=new PlayerShip();this.aliens=[];this.bullets=[];this.particles=[];this.acc=0;this.lastShot=-Infinity;}
 get speed(){return Math.min(CONFIG.MAX_SPEED,this.baseSpeed+this.level);}
 start(speed){const n=Number(speed);if(!Number.isInteger(n)||n<1||n>CONFIG.MAX_SPEED)throw new InvalidSpeedError('Оберіть швидкість від 1 до 10.');this.reset(n);this.spawnWave();this.state='running';this.emit('start');this.updateStats();}
 updateStats(){this.emit('score',{score:this.score,kills:this.kills,speed:this.speed});}
 spawnWave(){this.aliens=[];for(let r=0;r<CONFIG.WAVE_ROWS;r++)for(let c=0;c<CONFIG.COLS;c++)this.aliens.push(new AlienShip(c,r,r));}
 togglePause(){if(!['running','paused'].includes(this.state))return;this.state=this.state==='running'?'paused':'running';this.emit('pause',{paused:this.state==='paused'});}
 move(dc){if(this.state!=='running')return;try{this.player.moveBy(dc,0);}catch(e){if(!(e instanceof OutOfBoundsError))throw e;}}
 fire(){const now=performance.now();if(this.state!=='running'||now-this.lastShot<CONFIG.SHOT_COOLDOWN)return;this.lastShot=now;this.bullets.push({x:this.player.x+25,y:this.player.y+8,col:this.player.col});soundFX.shoot();}
 kill(a){a.destroy();this.kills++;this.score+=CONFIG.SCORE_PER_KILL;const level=Math.floor(this.score/CONFIG.LEVEL_UP_SCORE);if(level>this.level){this.level=level;this.emit('levelup');}soundFX.explosion();for(let i=0;i<18;i++){const angle=Math.random()*Math.PI*2,v=40+Math.random()*150;this.particles.push({x:a.x+25,y:a.y+25,vx:Math.cos(angle)*v,vy:Math.sin(angle)*v,life:.4,color:a.color});}this.updateStats();}
 update(dt){this.acc+=dt;while(this.acc>=CONFIG.TIME_UNIT/this.speed&&this.state==='running'){this.acc-=CONFIG.TIME_UNIT/this.speed;for(const a of this.aliens)a.row++;if(this.aliens.some(a=>a.row>=this.player.row)){this.state='over';this.emit('gameover',{score:this.score,kills:this.kills});}}
 if(this.state!=='running')return;
 const remaining=[];
 for(const b of this.bullets){const old=b.y;b.y-=CONFIG.BULLET_SPEED*dt/1000;const half=CONFIG.BULLET_SIZE/2;const target=this.aliens.filter(a=>a.alive&&a.col===b.col&&b.y-half<=a.y+37&&old+half>=a.y+9).sort((a,b)=>b.row-a.row)[0];if(target)this.kill(target);else if(b.y+half>=0)remaining.push(b);}
 this.bullets=remaining;this.aliens=this.aliens.filter(a=>a.alive);if(!this.aliens.length){this.bullets=[];this.spawnWave();}
 for(const p of this.particles){p.life-=dt/1000;p.x+=p.vx*dt/1000;p.y+=p.vy*dt/1000;p.vy+=150*dt/1000;}this.particles=this.particles.filter(p=>p.life>0);
 }
 loop(t){const dt=this.last?Math.min(t-this.last,50):0;this.last=t;if(this.state==='running')this.update(dt);this.draw(dt);requestAnimationFrame(n=>this.loop(n));}
 draw(dt){const c=this.ctx;c.fillStyle=CONFIG.COLORS.bg;c.fillRect(0,0,this.width,this.height);c.fillStyle='#7791b7';for(const s of this.stars){if(this.state==='running')s.y=(s.y+s.v*dt/1000)%this.height;c.fillRect(s.x,s.y,1.5,1.5);}c.strokeStyle=CONFIG.COLORS.grid;c.lineWidth=1;c.beginPath();for(let x=50;x<this.width;x+=50){c.moveTo(x,0);c.lineTo(x,this.height);}for(let y=50;y<this.height;y+=50){c.moveTo(0,y);c.lineTo(this.width,y);}c.stroke();c.strokeStyle='#ff2d9566';c.setLineDash([5,6]);c.beginPath();c.moveTo(0,this.height-50);c.lineTo(this.width,this.height-50);c.stroke();c.setLineDash([]);this.aliens.forEach(a=>a.draw(c));if(this.state!=='idle')this.player.draw(c);c.fillStyle=CONFIG.COLORS.bullet;c.shadowColor=CONFIG.COLORS.bullet;c.shadowBlur=10;for(const b of this.bullets)c.fillRect(Math.round(b.x-3),Math.round(b.y-3),6,6);c.shadowBlur=0;for(const p of this.particles){c.globalAlpha=Math.max(0,p.life/.4);c.fillStyle=p.color;c.fillRect(p.x,p.y,3,3);}c.globalAlpha=1;}
}
