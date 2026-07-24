// 暗香盈袖 UI v2 — 酒馆状态栏增强
// 通过 jsDelivr CDN 加载，增强正则模板渲染的状态栏

function injectStyles() {
  if (document.getElementById('ax-styles')) return;
  const css = document.createElement('style');
  css.id = 'ax-styles';
  css.textContent = `
    /* 增强 .hs 状态栏卡片 */
    .hs {
      border: 1px solid rgba(196,32,63,0.3) !important;
      box-shadow: 0 0 40px rgba(196,32,63,0.08), 0 8px 32px rgba(0,0,0,0.5) !important;
      transition: box-shadow 0.3s ease !important;
    }
    .hs:hover {
      box-shadow: 0 0 60px rgba(196,32,63,0.15), 0 12px 40px rgba(0,0,0,0.6) !important;
    }
    .hs::before {
      content: '' !important;
      display: block !important;
      height: 3px !important;
      background: linear-gradient(90deg, #c4203f, #b8944e, #7b3fa3, #c4203f) !important;
    }
    .hs-badge {
      color: #c4203f !important;
      font-weight: 700 !important;
    }

    /* 聊天文本增强 */
    .mes_text {
      line-height: 1.75 !important;
      font-size: 14px !important;
    }

    /* 操作按钮样式 */
    .ax-action-btn {
      display: inline-block;
      margin: 2px 4px;
      padding: 4px 12px;
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 6px;
      background: rgba(255,255,255,0.03);
      color: #807090;
      font-size: 11px;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .ax-action-btn:hover {
      background: rgba(196,32,63,0.15);
      color: #e8e0f0;
      border-color: rgba(196,32,63,0.3);
    }
  `;
  document.head.appendChild(css);
}

// 扫描并增强已渲染的状态栏
function enhanceStatusCards() {
  const cards = document.querySelectorAll('.hs:not([data-ax])');
  cards.forEach(card => {
    card.setAttribute('data-ax', '1');

    // 解析角色列表，为每个角色的行动选项添加可点击按钮
    const body = card.querySelector('.hs-body');
    if (!body) return;

    const text = body.textContent || '';
    const actionMatch = text.match(/行动选项[\s\S]*?选项:([\s\S]*?)$/);
    if (!actionMatch) return;

    const actions = actionMatch[1]
      .split('\n')
      .filter(l => l.match(/^\s*-\s*"/))
      .map(l => l.replace(/^\s*-\s*"\d+\.\s*/, '').replace(/"$/, '').trim());

    if (actions.length === 0) return;

    // 创建操作按钮区域
    const btnContainer = document.createElement('div');
    btnContainer.style.cssText = 'padding:8px 20px 12px;border-top:1px solid rgba(255,255,255,0.04);';
    const title = document.createElement('div');
    title.style.cssText = 'font-size:10px;color:#504868;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:6px;';
    title.textContent = '快捷操作';
    btnContainer.appendChild(title);

    actions.forEach((action, i) => {
      const btn = document.createElement('span');
      btn.className = 'ax-action-btn';
      btn.textContent = (i + 1) + '. ' + action;
      btn.title = '点击复制到输入框';
      btn.addEventListener('click', () => {
        // 尝试填入酒馆输入框
        const input = document.getElementById('send_textarea') || document.querySelector('textarea');
        if (input) {
          input.value = action;
          input.focus();
          input.dispatchEvent(new Event('input', { bubbles: true }));
        }
      });
      btnContainer.appendChild(btn);
    });

    card.appendChild(btnContainer);
  });
}

// 监听 DOM 变化
function watchDOM() {
  const observer = new MutationObserver(() => {
    enhanceStatusCards();
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

// 初始化
function init() {
  injectStyles();
  enhanceStatusCards();
  watchDOM();
  console.log('%c暗香盈袖 UI v2 已注入', 'color:#c4203f;font-weight:bold;');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
