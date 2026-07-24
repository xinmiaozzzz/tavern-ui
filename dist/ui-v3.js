// 暗香盈袖 UI v3 — 完整状态面板
(function(){
if(document.getElementById('ax-panel'))return;

// ====== CSS ======
const style=document.createElement('style');
style.id='ax-styles';
style.textContent=`
#ax-panel{position:fixed;right:0;top:0;width:320px;height:100vh;background:#08080f;border-left:1px solid rgba(255,255,255,0.06);z-index:9999;overflow-y:auto;font-family:"PingFang SC","Microsoft YaHei",sans-serif;color:#b8a8c8;font-size:12px;box-shadow:-4px 0 32px rgba(0,0,0,0.5)}
#ax-panel .ax-hd{background:linear-gradient(160deg,#0a0218,#140820);padding:16px 20px;border-bottom:1px solid rgba(196,32,63,0.2);position:sticky;top:0;z-index:2}
#ax-panel .ax-hd::after{content:'';position:absolute;bottom:0;left:0;right:0;height:2px;background:linear-gradient(90deg,#c4203f,#b8944e,#7b3fa3,#c4203f)}
#ax-panel .ax-title{font-size:15px;font-weight:700;color:#e8e0f0;letter-spacing:0.04em}
#ax-panel .ax-sub{font-size:11px;color:#786890;margin-top:2px}
#ax-panel .ax-close{position:absolute;top:14px;right:16px;width:28px;height:28px;border-radius:6px;border:1px solid rgba(255,255,255,0.08);background:transparent;color:#786890;cursor:pointer;font-size:14px;display:flex;align-items:center;justify-content:center;transition:all .15s}
#ax-panel .ax-close:hover{background:rgba(196,32,63,0.2);color:#e8e0f0;border-color:rgba(196,32,63,0.4)}
#ax-panel .ax-ch{margin:8px 14px;padding:12px 14px;background:rgba(255,255,255,0.015);border:1px solid rgba(255,255,255,0.04);border-radius:8px;transition:all .15s}
#ax-panel .ax-ch:hover{border-color:rgba(255,255,255,0.1);background:rgba(255,255,255,0.025)}
#ax-panel .ax-chn{font-size:13px;font-weight:700;color:#e8e0f0;margin-bottom:6px;padding-bottom:4px;border-bottom:1px solid rgba(255,255,255,0.04)}
#ax-panel .ax-row{display:flex;gap:6px;margin:3px 0;line-height:1.5}
#ax-panel .ax-lb{color:#504868;min-width:32px;font-weight:600;font-size:10px;text-transform:uppercase;letter-spacing:0.04em}
#ax-panel .ax-vl{color:#b8a8c8;font-size:11px}
#ax-panel .ax-vl.inner{color:#c89090}
#ax-panel .ax-act{margin:8px 14px;padding:10px 14px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.04);border-radius:8px}
#ax-panel .ax-act-t{font-size:10px;color:#504868;font-weight:700;letter-spacing:0.06em;margin-bottom:6px;text-transform:uppercase}
#ax-panel .ax-act-b{display:block;width:100%;margin:2px 0;padding:6px 10px;border:1px solid rgba(255,255,255,0.06);border-radius:6px;background:rgba(255,255,255,0.02);color:#786890;font-size:11px;cursor:pointer;text-align:left;transition:all .15s}
#ax-panel .ax-act-b:hover{background:rgba(196,32,63,0.1);color:#e8e0f0;border-color:rgba(196,32,63,0.3)}
#ax-panel .ax-vars{margin:8px 14px;padding:10px 14px;background:rgba(184,148,78,0.03);border:1px solid rgba(184,148,78,0.08);border-radius:8px}
#ax-panel .ax-var-r{display:flex;justify-content:space-between;margin:3px 0;font-size:11px}
#ax-panel .ax-var-k{color:#786890}#ax-panel .ax-var-v{color:#b8944e;font-weight:600}
#ax-toggle{position:fixed;right:8px;top:50%;transform:translateY(-50%);width:32px;height:80px;border-radius:8px 0 0 8px;border:1px solid rgba(255,255,255,0.08);border-right:none;background:rgba(8,8,15,0.9);color:#786890;cursor:pointer;z-index:9998;font-size:11px;writing-mode:vertical-rl;letter-spacing:0.1em;transition:all .15s}
#ax-toggle:hover{color:#c4203f;border-color:rgba(196,32,63,0.3);background:rgba(8,8,15,1)}
.hs{border-color:rgba(196,32,63,0.25)!important;box-shadow:0 0 40px rgba(196,32,63,0.06),0 8px 32px rgba(0,0,0,0.5)!important}
.hs::before{content:''!important;display:block!important;height:3px!important;background:linear-gradient(90deg,#c4203f,#b8944e,#7b3fa3,#c4203f)!important}
.hs-badge{color:#c4203f!important;font-weight:700!important}
.mes_text{line-height:1.75!important;font-size:14px!important}
`;
document.head.appendChild(style);

// ====== PANEL ======
const panel=document.createElement('div');
panel.id='ax-panel';
panel.innerHTML='<div class="ax-hd"><div class="ax-title">暗香盈袖</div><div class="ax-sub" id="ax-scene">加载中...</div><button class="ax-close" id="ax-close-btn">×</button></div><div id="ax-content">检测回复中的状态信息...</div>';
document.body.appendChild(panel);

// ====== TOGGLE ======
const toggle=document.createElement('div');
toggle.id='ax-toggle';
toggle.textContent='状态面板';
toggle.addEventListener('click',()=>{
  panel.style.display=panel.style.display==='none'?'block':'none';
});
document.body.appendChild(toggle);
document.getElementById('ax-close-btn').addEventListener('click',()=>{panel.style.display='none';});

// ====== PARSER ======
function parseStatusText(text){
  const result={date:'',location:'',characters:[],actions:[],vars:{}};
  const dm=text.match(/日期和时间:\s*"[^"]*?([\d\/]+\s*[\d:]+)/);
  if(dm)result.date=dm[1].trim();
  const lm=text.match(/地点:\s*"[^"]*?([^"]+)/);
  if(lm)result.location=lm[1].trim();

  const blocks=text.split(/\n\s*- 用户:/).slice(1);
  blocks.forEach(block=>{
    const ch={};
    const m=k=>{const r=block.match(new RegExp(k+':\\s*"([^"]*)"'));return r?r[1].trim():null;};
    const name=m('名字');if(!name)return;
    ch.name=name;
    const act=m('行动');if(act)ch.action=act;
    const inner=m('内心');if(inner)ch.inner=inner;
    const wear=m('穿搭');if(wear)ch.wear=wear;
    const pussy=m('小穴');if(pussy)ch.pussy=pussy;
    const chest=m('胸部');if(chest)ch.chest=chest;
    const ass=m('肛门');if(ass)ch.ass=ass;
    const mouth=m('嘴');if(mouth)ch.mouth=mouth;
    const dick=m('阳具');if(dick)ch.dick=dick;
    result.characters.push(ch);
  });

  const am=text.match(/行动选项[\s\S]*?选项:\s*\n([\s\S]*?)$/);
  if(am){
    result.actions=am[1].split('\n').filter(l=>/^\s*-/.test(l)).map(l=>l.replace(/^\s*-\s*"\d+\.\s*/,'').replace(/"$/,'').trim());
  }
  return result;
}

function escape(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}

function renderPanel(data){
  const content=document.getElementById('ax-content');
  document.getElementById('ax-scene').textContent=data.location||data.date||'当前状态';

  let charsHTML=data.characters.map(ch=>{
    let rows='';
    if(ch.action)rows+='<div class="ax-row"><span class="ax-lb">行动</span><span class="ax-vl">'+escape(ch.action)+'</span></div>';
    if(ch.inner)rows+='<div class="ax-row"><span class="ax-lb">内心</span><span class="ax-vl inner">'+escape(ch.inner)+'</span></div>';
    if(ch.wear)rows+='<div class="ax-row"><span class="ax-lb">穿着</span><span class="ax-vl">'+escape(ch.wear)+'</span></div>';
    if(ch.pussy)rows+='<div class="ax-row"><span class="ax-lb">小穴</span><span class="ax-vl">'+escape(ch.pussy)+'</span></div>';
    if(ch.chest)rows+='<div class="ax-row"><span class="ax-lb">胸部</span><span class="ax-vl">'+escape(ch.chest)+'</span></div>';
    if(ch.ass)rows+='<div class="ax-row"><span class="ax-lb">肛门</span><span class="ax-vl">'+escape(ch.ass)+'</span></div>';
    if(ch.mouth)rows+='<div class="ax-row"><span class="ax-lb">嘴</span><span class="ax-vl">'+escape(ch.mouth)+'</span></div>';
    if(ch.dick)rows+='<div class="ax-row"><span class="ax-lb">阳具</span><span class="ax-vl">'+escape(ch.dick)+'</span></div>';
    return '<div class="ax-ch"><div class="ax-chn">'+escape(ch.name)+'</div>'+rows+'</div>';
  }).join('');

  let actionsHTML='';
  if(data.actions.length>0){
    actionsHTML='<div class="ax-act"><div class="ax-act-t">行动选项</div>';
    data.actions.forEach((a,i)=>{
      actionsHTML+='<button class="ax-act-b" onclick="var t=document.getElementById(\'send_textarea\')||document.querySelector(\'textarea\');if(t){t.value=\''+escape(a).replace(/'/g,"\\'")+'\';t.focus();t.dispatchEvent(new Event(\'input\',{bubbles:true}));}">'+(i+1)+'. '+escape(a)+'</button>';
    });
    actionsHTML+='</div>';
  }

  content.innerHTML=charsHTML+actionsHTML;
}

// ====== SCANNER ======
function scanMessages(){
  const allText=document.body.innerText||'';
  const idx=allText.indexOf('状态栏:');
  if(idx<0)return;
  const text=allText.substring(idx,idx+3000);
  const data=parseStatusText(text);
  if(data.characters.length>0||data.actions.length>0){
    renderPanel(data);
  }
}

// ====== WATCH ======
const observer=new MutationObserver(()=>{scanMessages();});
observer.observe(document.body,{childList:true,subtree:true,characterData:true});

// Initial scan
setTimeout(scanMessages,2000);
scanMessages();

console.log('%c暗香盈袖 UI v3 已注入%c — 右侧状态面板','color:#c4203f;font-weight:bold','color:#786890');
})();
