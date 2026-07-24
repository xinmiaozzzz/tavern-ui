// 暗香盈袖 UI v3.1 — 导入即显示
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
#ax-panel .ax-info{margin:8px 14px;padding:12px 14px;color:#786890;font-size:11px;line-height:1.6;text-align:center}
#ax-toggle{position:fixed;right:8px;top:50%;transform:translateY(-50%);width:32px;height:80px;border-radius:8px 0 0 8px;border:1px solid rgba(255,255,255,0.08);border-right:none;background:rgba(8,8,15,0.9);color:#786890;cursor:pointer;z-index:9998;font-size:11px;writing-mode:vertical-rl;letter-spacing:0.1em;transition:all .15s}
#ax-toggle:hover{color:#c4203f;border-color:rgba(196,32,63,0.3);background:rgba(8,8,15,1)}
.hs{border-color:rgba(196,32,63,0.25)!important;box-shadow:0 0 40px rgba(196,32,63,0.06),0 8px 32px rgba(0,0,0,0.5)!important}
.hs::before{content:''!important;display:block!important;height:3px!important;background:linear-gradient(90deg,#c4203f,#b8944e,#7b3fa3,#c4203f)!important}
.hs-badge{color:#c4203f!important;font-weight:700!important}
`;
document.head.appendChild(style);

// ====== PANEL ======
const panel=document.createElement('div');
panel.id='ax-panel';
panel.innerHTML='<div class="ax-hd"><div class="ax-title">暗香盈袖</div><div class="ax-sub" id="ax-scene">真相揭露期 · 2011/09/01</div><button class="ax-close" id="ax-close-btn">×</button></div><div id="ax-content"></div>';
document.body.appendChild(panel);

// ====== TOGGLE ======
const toggle=document.createElement('div');
toggle.id='ax-toggle';
toggle.textContent='状态面板';
toggle.addEventListener('click',function(){panel.style.display=panel.style.display==='none'?'block':'none';});
document.body.appendChild(toggle);
document.getElementById('ax-close-btn').addEventListener('click',function(){panel.style.display='none';});

// ====== DEFAULT DATA (shown immediately) ======
var defaultData={
  date:'2011/09/01 15:00',
  location:'北京首都机场 T3 航站楼',
  characters:[
    {name:'白颖',action:'刚从剑桥回国，在机场与左京重逢',inner:'老公来接我了...他看起来很高兴。但我这半年在剑桥的每一天都是谎言。郝江化飞过来住了整整一个月，我的身体还记得他鸡巴的形状。',wear:'驼色羊毛开衫+牛仔裤。大腿内侧淤青被遮瑕膏盖了三层。全新白色棉质内衣。',pussy:'蝴蝶屄深处因失去郝江化黑玉龙王填塞而空虚痉挛。尽管用指腹反复抠挖冲洗了一小时，内壁仍在收缩——它不习惯没有巨物填满的感觉',chest:'D罩杯在开衫下自然起伏，乳头因回想剑桥别墅里被粗暴揉捏而微微挺立',ass:'紧窄，郝江化反复尝试进入但未得逞——她说「除非左京同意」',mouth:'用漱口水反复漱口三次，舌根仍残留排毒胶囊的苦味'},
    {name:'左京',action:'在到达口等了四十分钟，手里握着一杯凉透的咖啡',inner:'她的眼睛红了两次。拥抱太用力了，像是在道歉。头发上有陌生的茉莉沐浴液气味。',wear:'深灰休闲衬衫+黑色长裤，袖口微卷',dick:'疲软，久别重逢的激动中毫无反应'}
  ],
  actions:['装作什么都没注意到，接过行李箱直接去停车场','在电梯口停下来，双手扶着她的肩膀认真看她一眼','注意到她走路的姿势有些不同——双腿夹得比平时紧','把她拉进怀里深深吻住她的嘴']
};

// ====== PARSER ======
function parseStatusText(text){
  var result={date:'',location:'',characters:[],actions:[]};
  var dm=text.match(/日期和时间:\s*"[^"]*?([\d\/]+\s*[\d:]+)/);
  if(dm)result.date=dm[1].trim();
  var lm=text.match(/地点:\s*"[^"]*?([^"]+)/);
  if(lm)result.location=lm[1].trim();
  var blocks=text.split(/\n\s*- 用户:/).slice(1);
  blocks.forEach(function(block){
    var ch={};
    function m(k){var r=block.match(new RegExp(k+':\\s*"([^"]*)"'));return r?r[1].trim():null;}
    var name=m('名字');if(!name)return;
    ch.name=name;
    var act=m('行动');if(act)ch.action=act;
    var inner=m('内心');if(inner)ch.inner=inner;
    var wear=m('穿搭');if(wear)ch.wear=wear;
    var pussy=m('小穴');if(pussy)ch.pussy=pussy;
    var chest=m('胸部');if(chest)ch.chest=chest;
    var ass=m('肛门');if(ass)ch.ass=ass;
    var mouth=m('嘴');if(mouth)ch.mouth=mouth;
    var dick=m('阳具');if(dick)ch.dick=dick;
    result.characters.push(ch);
  });
  var am=text.match(/行动选项[\s\S]*?选项:\s*\n([\s\S]*?)$/);
  if(am){result.actions=am[1].split('\n').filter(function(l){return /^\s*-/.test(l);}).map(function(l){return l.replace(/^\s*-\s*"\d+\.\s*/,'').replace(/"$/,'').trim();});}
  return result;
}

function escapeHTML(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}

function renderPanel(data){
  var content=document.getElementById('ax-content');
  var scene=document.getElementById('ax-scene');
  if(data.location)scene.textContent=data.location+' · '+data.date;
  else scene.textContent='真相揭露期 · '+data.date;

  var charsHTML=data.characters.map(function(ch){
    var rows='';
    if(ch.action)rows+='<div class="ax-row"><span class="ax-lb">行动</span><span class="ax-vl">'+escapeHTML(ch.action)+'</span></div>';
    if(ch.inner)rows+='<div class="ax-row"><span class="ax-lb">内心</span><span class="ax-vl inner">'+escapeHTML(ch.inner)+'</span></div>';
    if(ch.wear)rows+='<div class="ax-row"><span class="ax-lb">穿着</span><span class="ax-vl">'+escapeHTML(ch.wear)+'</span></div>';
    if(ch.pussy)rows+='<div class="ax-row"><span class="ax-lb">小穴</span><span class="ax-vl">'+escapeHTML(ch.pussy)+'</span></div>';
    if(ch.chest)rows+='<div class="ax-row"><span class="ax-lb">胸部</span><span class="ax-vl">'+escapeHTML(ch.chest)+'</span></div>';
    if(ch.ass)rows+='<div class="ax-row"><span class="ax-lb">肛门</span><span class="ax-vl">'+escapeHTML(ch.ass)+'</span></div>';
    if(ch.mouth)rows+='<div class="ax-row"><span class="ax-lb">嘴</span><span class="ax-vl">'+escapeHTML(ch.mouth)+'</span></div>';
    if(ch.dick)rows+='<div class="ax-row"><span class="ax-lb">阳具</span><span class="ax-vl">'+escapeHTML(ch.dick)+'</span></div>';
    return '<div class="ax-ch"><div class="ax-chn">'+escapeHTML(ch.name)+'</div>'+rows+'</div>';
  }).join('');

  var actionsHTML='';
  if(data.actions.length>0){
    actionsHTML='<div class="ax-act"><div class="ax-act-t">行动选项</div>';
    data.actions.forEach(function(a,i){
      var safeA=escapeHTML(a).replace(/'/g,"\\'");
      actionsHTML+='<button class="ax-act-b" onclick="var t=document.getElementById(\'send_textarea\')||document.querySelector(\'textarea\');if(t){t.value=\''+safeA+'\';t.focus();t.dispatchEvent(new Event(\'input\',{bubbles:true}));}">'+(i+1)+'. '+escapeHTML(a)+'</button>';
    });
    actionsHTML+='</div>';
  }

  content.innerHTML=charsHTML+actionsHTML;
}

// ====== SCAN & UPDATE ======
function scanAndUpdate(){
  var allText=document.body.innerText||'';
  var idx=allText.indexOf('状态栏:');
  if(idx>=0){
    var text=allText.substring(idx,idx+3000);
    var data=parseStatusText(text);
    if(data.characters.length>0){renderPanel(data);return;}
  }
  // Fallback: keep showing default data if no Status_block found yet
  if(!document.getElementById('ax-content').innerHTML.trim()){
    renderPanel(defaultData);
  }
}

// ====== SHOW DEFAULT IMMEDIATELY ======
renderPanel(defaultData);

// ====== WATCH ======
var observer=new MutationObserver(function(){scanAndUpdate();});
observer.observe(document.body,{childList:true,subtree:true,characterData:true});
setTimeout(scanAndUpdate,1000);
setTimeout(scanAndUpdate,3000);

console.log('%c暗香盈袖 UI v3.1%c — 右侧状态面板已就绪','color:#c4203f;font-weight:bold','color:#786890');
})();
