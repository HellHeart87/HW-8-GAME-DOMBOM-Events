'use strict';
class SoundFX {
 constructor(){this.context=null;this.enabled=true;}
 resume(){try{const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;if(!this.context)this.context=new AC();if(this.context.state==='suspended')this.context.resume().catch(()=>{});}catch(_){} }
 tone(f,end,d,type,volume){const c=this.context;if(!this.enabled||!c||c.state!=='running')return;const t=c.currentTime,o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.setValueAtTime(f,t);o.frequency.exponentialRampToValueAtTime(end,t+d);g.gain.setValueAtTime(volume,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g);g.connect(c.destination);o.start(t);o.stop(t+d);o.onended=()=>{o.disconnect();g.disconnect();};}
 shoot(){this.tone(880,180,.12,'square',.045);}
 explosion(){const c=this.context;if(!this.enabled||!c||c.state!=='running')return;const d=.32,t=c.currentTime,b=c.createBuffer(1,Math.ceil(c.sampleRate*d),c.sampleRate),a=b.getChannelData(0);for(let i=0;i<a.length;i++)a[i]=Math.random()*2-1;const s=c.createBufferSource(),f=c.createBiquadFilter(),g=c.createGain();s.buffer=b;f.type='lowpass';f.frequency.setValueAtTime(1800,t);f.frequency.exponentialRampToValueAtTime(100,t+d);g.gain.setValueAtTime(.16,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);s.connect(f);f.connect(g);g.connect(c.destination);s.start(t);s.onended=()=>{s.disconnect();f.disconnect();g.disconnect();};this.tone(150,35,.28,'sawtooth',.07);}
}
const soundFX=new SoundFX();
