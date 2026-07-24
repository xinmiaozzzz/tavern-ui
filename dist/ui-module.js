// ============================================================
// 暗香盈袖 · 酒馆 UI 增强脚本
// 为 SillyTavern 注入暗黑风格状态栏和增强界面
// ============================================================

(function() {
'use strict';

// ======== STYLES ========
const CSS = `
/* 状态栏暗黑增强 - 匹配正则模板 .hs 系列类名 */
.hs {
  width: 96%; max-width: 680px; margin: 14px auto;
  background: #06060d !important; border: 1px solid rgba(255,255,255,0.08) !important;
  border-radius: 16px !important; overflow: hidden;
  box-shadow: 0 8px 40px rgba(0,0,0,0.6), 0 0 60px rgba(196,32,63,0.06) !important;
  font-family: "PingFang SC","Microsoft YaHei","Noto Sans SC","Hiragino Sans GB",sans-serif !important;
}
.hs-head {
  background: linear-gradient(160deg,#0a0218,#140820 35%,#1a0828 65%,#0d0418) !important;
  padding: 18px 22px !important;
  border-bottom: 1px solid rgba(155,48,255,0.08) !important;
}
.hs-time {
  font-size: 18px !important; font-weight: 700 !important; color: #ede4f4 !important;
  text-shadow: 0 1px 6px rgba(155,48,255,0.15) !important;
}
.hs-loc { font-size: 13px !important; color: #807090 !important; margin-top: 5px !important; }
.hs-badge {
  position: absolute; top: 14px; right: 22px; font-size: 8px;
  color: rgba(196,32,63,0.35) !important; letter-spacing: 3px; font-weight: 700 !important;
}
.hs-body {
  padding: 16px 20px !important; font-size: 13px !important;
  line-height: 1.8 !important; color: #c0aec8 !important;
  max-height: 520px; overflow-y: auto;
}
.hs-body::selection { background: rgba(196,32,63,0.3); color: #f0d0d0; }
.hs::-webkit-scrollbar { width: 5px; }
.hs::-webkit-scrollbar-track { background: transparent; }
.hs::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 3px; }

/* 增强阴影和辉光 */
.hs:hover { box-shadow: 0 12px 48px rgba(0,0,0,0.7), 0 0 80px rgba(196,32,63,0.08) !important; }

/* 增强聊天文本 */
.mes_text { line-height: 1.75 !important; font-size: 14px !important; }
`;

// ======== INJECT CSS ========
function injectCSS() {
  if (document.getElementById('tavern-ui-styles')) return;
  const style = document.createElement('style');
  style.id = 'tavern-ui-styles';
  style.textContent = CSS;
  document.head.appendChild(style);
}

// ======== PARSE STATUS BLOCK ========
function parseStatusBlock(text) {
  const result = { date: '', location: '', characters: [], actions: [] };

  const dateMatch = text.match(/日期和时间:\s*"[^"]*?([\d\/]+\s*[\d:]+)/);
  if (dateMatch) result.date = dateMatch[1].trim();

  const locMatch = text.match(/地点:\s*"[^"]*?([^"]+)/);
  if (locMatch) result.location = locMatch[1].trim();

  // Parse character blocks
  const charBlocks = text.split(/\n\s*- 用户:/).slice(1);
  result.characters = charBlocks.map(block => {
    const ch = {};
    const m = (key) => {
      const r = block.match(new RegExp(key + ':\\s*"([^"]*)"'));
      return r ? r[1].trim() : null;
    };
    const name = m('名字');
    if (!name) return null;
    ch.name = name;
    const act = m('行动'); if (act) ch.action = act;
    const inner = m('内心'); if (inner) ch.inner = inner;
    const wear = m('穿搭'); if (wear) ch.wear = wear;
    const pussy = m('小穴'); if (pussy) ch.pussy = pussy;
    const chest = m('胸部'); if (chest) ch.chest = chest;
    const ass = m('肛门'); if (ass) ch.ass = ass;
    const mouth = m('嘴'); if (mouth) ch.mouth = mouth;
    const dick = m('阳具'); if (dick) ch.dick = dick;
    const recent = m('最近性行为'); if (recent) ch.recent = recent;
    return ch;
  }).filter(Boolean);

  // Parse actions
  const actSection = text.match(/行动选项:[\s\S]*?选项:\s*\n([\s\S]*?)$/);
  if (actSection) {
    result.actions = actSection[1]
      .split('\n')
      .filter(l => /^\s*-/.test(l))
      .map(l => l.replace(/^\s*-\s*"\d+\.\s*/, '').replace(/"$/, '').trim());
  }

  return result;
}

// ======== RENDER STATUS CARD ========
function renderStatusCard(data) {
  let charsHTML = data.characters.map(ch => {
    let rows = '';
    if (ch.action) rows += `<div class="sb-row"><span class="sb-lb">行动</span><span class="sb-vl">${escapeHTML(ch.action)}</span></div>`;
    if (ch.inner) rows += `<div class="sb-row"><span class="sb-lb">内心</span><span class="sb-vl inner">${escapeHTML(ch.inner)}</span></div>`;
    if (ch.wear) rows += `<div class="sb-row"><span class="sb-lb">穿着</span><span class="sb-vl">${escapeHTML(ch.wear)}</span></div>`;
    if (ch.pussy) rows += `<div class="sb-row"><span class="sb-lb">小穴</span><span class="sb-vl">${escapeHTML(ch.pussy)}</span></div>`;
    if (ch.chest) rows += `<div class="sb-row"><span class="sb-lb">胸部</span><span class="sb-vl">${escapeHTML(ch.chest)}</span></div>`;
    if (ch.ass) rows += `<div class="sb-row"><span class="sb-lb">肛门</span><span class="sb-vl">${escapeHTML(ch.ass)}</span></div>`;
    if (ch.mouth) rows += `<div class="sb-row"><span class="sb-lb">嘴</span><span class="sb-vl">${escapeHTML(ch.mouth)}</span></div>`;
    if (ch.dick) rows += `<div class="sb-row"><span class="sb-lb">阳具</span><span class="sb-vl">${escapeHTML(ch.dick)}</span></div>`;
    return `<div class="sb-ch"><div class="sb-cn">${escapeHTML(ch.name)}</div>${rows}</div>`;
  }).join('');

  let actionsHTML = '';
  if (data.actions.length > 0) {
    actionsHTML = data.actions.map((a, i) => {
      const safeAction = escapeHTML(a).replace(/'/g, "\\'");
      return `<div class="sb-row" style="padding:4px 8px;cursor:pointer;border-radius:4px;margin:2px 0;color:#786890;font-size:11px;transition:all .15s" onclick="this.style.background='rgba(255,255,255,0.04)';this.style.color='#e8e0f0'" onmouseover="this.style.background='rgba(255,255,255,0.03)';this.style.color='#e8e0f0'" onmouseout="this.style.background='transparent';this.style.color='#786890'" title="点击复制">${i+1}. ${safeAction}</div>`;
    }).join('');
  }

  return `<div class="sb-premium">
    <div class="sb-hd">
      <div class="sb-badge">STATUS</div>
      <div class="sb-dt">${escapeHTML(data.date)}</div>
      <div class="sb-loc">${escapeHTML(data.location)}</div>
    </div>
    <div class="sb-bd">
      ${charsHTML}
      ${actionsHTML ? '<div style="margin-top:8px;padding-top:8px;border-top:1px solid rgba(255,255,255,0.04);font-size:10px;color:#504868;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:4px">行动选项</div>' + actionsHTML : ''}
    </div>
  </div>`;
}

function escapeHTML(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}


// ======== INIT ========
function init() {
  injectCSS();
  console.log("%c暗香盈袖 UI 已注入 %cv1.1","color:#c4203f;font-size:14px;font-weight:bold;","color:#786890;");
}
if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",init);}else{init();}
}}