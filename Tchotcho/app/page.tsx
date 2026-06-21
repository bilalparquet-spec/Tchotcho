
'use client'
import {useEffect,useRef,useState} from 'react';

export default function Page(){
 const cRef=useRef<HTMLCanvasElement>(null);
 const [best,setBest]=useState(0);

 useEffect(()=>{
 const canvas=cRef.current!; const ctx=canvas.getContext('2d')!;
 canvas.width=450; canvas.height=800;
 let birdY=300,v=0,score=0;
 let pipes=[{x:450,g:260},{x:700,g:380}];
 const bestScore=Number(localStorage.getItem('best')||0); setBest(bestScore);

 function reset(){
   birdY=300;v=0;score=0;pipes=[{x:450,g:260},{x:700,g:380}];
 }
 function jump(){v=-8}
 window.onclick=jump;
 window.onkeydown=(e)=>{if(e.code==='Space')jump()}

 function loop(){
  v+=0.45; birdY+=v;
  ctx.clearRect(0,0,450,800);
  ctx.fillStyle='#6ec6ff'; ctx.fillRect(0,0,450,800);

  pipes.forEach(p=>{
   p.x-=2.5;
   ctx.fillStyle='green';
   ctx.fillRect(p.x,0,70,p.g-90);
   ctx.fillRect(p.x,p.g+90,70,800);
   if(p.x<-70){p.x=520;p.g=180+Math.random()*300;score++}
   if(120+34>p.x&&120<p.x+70&&(birdY<p.g-90||birdY+34>p.g+90)){
      const b=Math.max(bestScore,score); localStorage.setItem('best',String(b)); setBest(b); reset();
   }
  });

  if(birdY<0||birdY>766){const b=Math.max(bestScore,score); localStorage.setItem('best',String(b)); setBest(b); reset();}
  ctx.fillStyle='white'; ctx.beginPath(); ctx.arc(120,birdY,18,0,7); ctx.fill();
  ctx.fillStyle='black'; ctx.font='24px monospace'; ctx.fillText('Score '+score,20,40);
  requestAnimationFrame(loop);
 }
 loop();
 },[]);

 return <div style={{display:'flex',flexDirection:'column',alignItems:'center',background:'#111',minHeight:'100vh'}}>
 <h1 style={{color:'white'}}>تشوشو مارج</h1>
 <canvas ref={cRef} style={{maxWidth:'100%',border:'2px solid white'}}/>
 <p style={{color:'white'}}>Best: {best}</p>
 </div>
}
