'use strict';
class Ship {
 constructor(col,row,color){this.col=col;this.row=row;this.color=color;this.alive=true;}
 get x(){return this.col*CONFIG.CELL;} get y(){return this.row*CONFIG.CELL;}
 moveBy(dc,dr){const c=this.col+dc,r=this.row+dr;if(c<0||c>=CONFIG.COLS||r<0||r>=CONFIG.ROWS)throw new OutOfBoundsError('За межами поля');this.col=c;this.row=r;}
 destroy(){this.alive=false;}
 sprite(ctx,pattern){const unit=4,x=this.x+(CONFIG.CELL-pattern[0].length*unit)/2,y=this.y+9;ctx.fillStyle=this.color;ctx.shadowColor=this.color;ctx.shadowBlur=10;pattern.forEach((line,r)=>[...line].forEach((v,c)=>{if(v==='1')ctx.fillRect(x+c*unit,y+r*unit,unit,unit);}));ctx.shadowBlur=0;}
}
class PlayerShip extends Ship {
 constructor(){super(Math.floor(CONFIG.COLS/2),CONFIG.ROWS-1,CONFIG.COLORS.player);}
 draw(ctx){this.sprite(ctx,['0001000','0011100','0011100','0111110','1111111','1101011','1000001']);}
}
class AlienShip extends Ship {
 constructor(c,r,t){super(c,r,CONFIG.COLORS.alien[t%CONFIG.COLORS.alien.length]);}
 draw(ctx){this.sprite(ctx,['0100010','0011100','0111110','1101011','1111111','1010101','0100010']);}
}
