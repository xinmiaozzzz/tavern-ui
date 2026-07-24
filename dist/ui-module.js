// ============================================================
// 暗香盈袖 · 酒馆 UI 增强脚本
// 为 SillyTavern 注入暗黑风格状态栏和增强界面
// ============================================================

(function() {
'use strict';

// ======== STYLES ========
const CSS = `
/* 状态栏美化 */
.sb-premium {
  width: 100%; max-width: 680px; margin: 14px auto;
  background: #08080f; border: 1px solid rgba(255,255,255,0.07);
  border-radius: 16px; overflow: hidden;
  box-shadow: 0 8px 40px rgba(0,0,0,0.6);
  font-family: "PingFang SC","Microsoft YaHei","Noto Sans SC","Hiragino Sans GB",sans-serif;
  position: relative;
}
.sb-premium::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
  background: linear-gradient(90deg,transparent,rgba(196,32,63,0.2),rgba(184,148,78,0.1),rgba(123,63,163,0.08),transparent);
  z-index: 3; pointer-events: none;
}
.sb-premium .sb-hd {
  background: linear-gradient(160deg,#0a0418,#120820 30%,#1a0b30 60%,#0d0618);
  padding: 16px 20px; border-bottom: 1px solid rgba(155,48,255,0.06);
  position: relative; overflow: hidden;
}
.sb-premium .sb-hd::after {
  content: ''; position: absolute; top: -60%; left: -30%; width: 160%; height: 220%;
  background: radial-gradient(ellipse at 25% 15%,rgba(196,32,63,0.07),transparent 55%),
              radial-gradient(ellipse at 75% 85%,rgba(123,63,163,0.04),transparent 50%);
  pointer-events: none;
}
.sb-premium .sb-badge {
  position: absolute; top: 12px; right: 20px; font-size: 8px;
  color: rgba(176,144,192,0.2); letter-spacing: 3px; text-transform: uppercase;
  z-index: 1; font-weight: 600;
}
.sb-premium .sb-dt {
  font-size: 17px; font-weight: 700; color: #e8e0f0; position: relative; z-index: 1;
  text-shadow: 0 1px 4px rgba(155,48,255,0.12); letter-spacing: 0.02em;
}
.sb-premium .sb-loc {
  font-size: 13px; color: #786890; margin-top: 4px; position: relative; z-index: 1;
}
.sb-premium .sb-bd {
  padding: 14px 18px; font-size: 12.5px; line-height: 1.7; color: #b8a8c8;
  max-height: 500px; overflow-y: auto; white-space: pre-wrap; word-break: break-word;
}
.sb-premium .sb-ch {
  margin-bottom: 10px; padding: 8px 12px;
  background: rgba(255,255,255,0.015); border-radius: 6px;
  border: 1px solid rgba(255,255,255,0.04);
}
.sb-premium .sb-cn {
  font-weight: 700; font-size: 13px; color: #e8e0f0; margin-bottom: 4px;
}
.sb-premium .sb-row { display: flex; gap: 8px; font-size: 11.5px; line-height: 1.6; }
.sb-premium .sb-lb {
  color: #504868; min-width: 36px; flex-shrink: 0;
  font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase;
}
.sb-premium .sb-vl { color: #b8a8c8; }
.sb-premium .sb-vl.inner { color: #c89090; }

/* 暗黑滚动条 */
.sb-premium .sb-bd::-webkit-scrollbar { width: 4px; }
.sb-premium .sb-bd::-webkit-scrollbar-track { background: transparent; }
.sb-premium .sb-bd::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.07); border-radius: 2px; }

/* 增强的消息气泡 */
.mes_text {
  line-height: 1.75 !important;
  font-size: 14px !important;
}
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

// ======== PROCESS MESSAGES ========
function processMessages() {
  // Find all message elements in the chat
  const mesElements = document.querySelectorAll('.mes, .mes_text, [class*="mes"]');
  mesElements.forEach(el => {
    if (el.dataset.tavernUiProcessed) return;
    el.dataset.tavernUiProcessed = '1';

    const text = el.textContent || el.innerText || '';
    const statusIdx = text.indexOf('状态栏:');
    if (statusIdx < 0) return;

    // Extract the Status_block text
    const statusText = text.substring(statusIdx);
    const endIdx = statusText.indexOf('行动选项');
    const relevantText = endIdx > 0 ? statusText.substring(0, endIdx + 200) : statusText;

    const data = parseStatusBlock(relevantText);
    if (!data.date && !data.location) return;

    // Find the StatusPlaceHolderImpl or raw Status_block and replace it
    const placeholder = el.querySelector('statusplaceholderimpl') || el;
    if (data.characters.length > 0 || data.date) {
      const card = document.createElement('div');
      card.innerHTML = renderStatusCard(data);
      card.style.marginTop = '10px';
      el.appendChild(card);
    }
  });
}

// ======== INIT ========
function init() {
  injectCSS();

  // Process existing messages
  processMessages();

  // Watch for new messages
  const observer = new MutationObserver(() => {
    processMessages();
  });

  const chatArea = document.querySelector('#chat') || document.querySelector('[class*="chat"]') || document.body;
  observer.observe(chatArea, { childList: true, subtree: true });

  console.log('%c暗香盈袖 UI 已注入 %cv1.0',
    'color:#c4203f;font-size:14px;font-weight:bold;',
    'color:#786890;');
}

// Start when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

