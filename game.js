(()=>{"use strict";
const $=id=>document.getElementById(id),canvas=$("game"),ctx=canvas.getContext("2d"),N=20,C=20;
let snake,food,dir,next,score=0,best=Number(localStorage.getItem("minimal-snake-best")||0),timer=null,running=false,paused=false,delay=200;
$("best").textContent=best;
function reset(){snake=[{x:8,y:10},{x:7,y:10},{x:6,y:10}];dir={x:1,y:0};next={...dir};score=0;$("score").textContent=0;spawn();draw()}
function spawn(){do{food={x:Math.floor(Math.random()*N),y:Math.floor(Math.random()*N)}}while(snake.some(p=>p.x===food.x&&p.y===food.y))}
function draw(){ctx.fillStyle="#e9e9df";ctx.fillRect(0,0,400,400);ctx.strokeStyle="#dedfd4";ctx.lineWidth=.7;for(let i=0;i<=N;i++){ctx.beginPath();ctx.moveTo(i*C,0);ctx.lineTo(i*C,400);ctx.stroke();ctx.beginPath();ctx.moveTo(0,i*C);ctx.lineTo(400,i*C);ctx.stroke()}ctx.fillStyle="#c47b3c";ctx.beginPath();ctx.arc(food.x*C+10,food.y*C+10,6,0,7);ctx.fill();snake.forEach((p,i)=>{ctx.fillStyle=i===0?"#263b30":"#59745e";ctx.beginPath();ctx.roundRect(p.x*C+2,p.y*C+2,16,16,5);ctx.fill()})}
function stop(){if(timer!==null)clearInterval(timer);timer=null}
function overlay(t,d,b){$("overlay-title").textContent=t;$("overlay-text").textContent=d;$("overlay-button").textContent=b;$("overlay").classList.remove("hidden")}
function start(){if(running&&!paused)return;if(!running)reset();paused=false;running=true;$("overlay").classList.add("hidden");$("pause").textContent="Pause";stop();timer=setInterval(tick,delay)}
function finish(){stop();running=false;paused=false;best=Math.max(best,score);localStorage.setItem("minimal-snake-best",best);$("best").textContent=best;overlay("Game over","Your score: "+score,"Play again")}
function tick(){dir={...next};let h={x:snake[0].x+dir.x,y:snake[0].y+dir.y},eat=h.x===food.x&&h.y===food.y,check=eat?snake:snake.slice(0,-1);if(h.x<0||h.x>=N||h.y<0||h.y>=N||check.some(p=>p.x===h.x&&p.y===h.y)){finish();return}snake.unshift(h);if(eat){score++;$("score").textContent=score;spawn()}else snake.pop();draw()}
function turn(d){if(!running||paused||d.x===-dir.x&&d.y===-dir.y)return;next=d}
function pause(){if(!running)return;if(paused){start();return}paused=true;stop();$("pause").textContent="Resume";overlay("Paused","Ready when you are.","Resume")}
$("overlay-button").addEventListener("click",()=>{if(running&&paused){start();return}running=false;start()});
$("pause").addEventListener("click",pause);
$("restart").addEventListener("click",()=>{stop();running=false;paused=false;reset();$("pause").textContent="Pause";overlay("SNAKE.","Swipe to move. Collect dots. Avoid the walls.","Start playing")});
$("speed").addEventListener("change",e=>{delay=+e.target.value;$("speed-label").textContent=delay===250?"VERY SLOW":delay===200?"SLOW":"NORMAL";if(running&&!paused){stop();timer=setInterval(tick,delay)}});
const keys={ArrowUp:{x:0,y:-1},ArrowDown:{x:0,y:1},ArrowLeft:{x:-1,y:0},ArrowRight:{x:1,y:0}};
document.addEventListener("keydown",e=>{if(keys[e.key]){e.preventDefault();turn(keys[e.key])}if(e.key===" "){e.preventDefault();pause()}});
let sx=0,sy=0;canvas.addEventListener("pointerdown",e=>{sx=e.clientX;sy=e.clientY;if(canvas.setPointerCapture)canvas.setPointerCapture(e.pointerId)});
canvas.addEventListener("pointerup",e=>{let dx=e.clientX-sx,dy=e.clientY-sy;if(Math.max(Math.abs(dx),Math.abs(dy))<18)return;if(Math.abs(dx)>Math.abs(dy))turn({x:Math.sign(dx),y:0});else turn({x:0,y:Math.sign(dy)})});
reset();})();