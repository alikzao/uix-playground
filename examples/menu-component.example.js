export const id = "menu-component";
export const title = "Menu Component (real)";
export const externals = "uixMenu=./vendor/uix-menu/src/index.js";

export const code = `const ensureStylesheet = (href) => {
  if (document.querySelector(\`link[data-uix-menu-style][href="\${href}"]\`)) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  link.setAttribute("data-uix-menu-style", "true");
  document.head.appendChild(link);
};

ensureStylesheet("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css");
ensureStylesheet("./vendor/uix-menu/src/tree.css");
document.documentElement.setAttribute("data-theme", "dark");

const ensureInlineStyle = () => {
  if (document.getElementById("uix-menu-demo-style")) return;
  const style = document.createElement("style");
  style.id = "uix-menu-demo-style";
  style.textContent = \`
    #menu-demo-shell {
      padding: 18px;
      background: #242528;
      min-height: 100vh;
      box-sizing: border-box;
    }
    #sidebar {
      width: 420px;
      max-width: calc(100vw - 64px);
      min-width: 300px;
      background: #333333;
      color: #ffffff;
      border-radius: 16px;
      border: 1px solid rgba(255,255,255,0.12);
      box-shadow: 0 18px 50px rgba(0,0,0,0.35);
      padding: 0 12px 0;
      box-sizing: border-box;
      overflow-y: auto;
      overflow-x: hidden;
      transition: width 160ms ease, min-width 160ms ease, max-width 160ms ease, padding 160ms ease;
    }
    #sidebar.collapsed {
      width: 74px !important;
      min-width: 74px !important;
      max-width: 74px !important;
      padding-left: 6px;
      padding-right: 6px;
    }
    #sidebar .node-content,
    #sidebar .leaf-node-content {
      color: #f2f4f8;
      font-family: "Inter", "Segoe UI", "Helvetica Neue", Arial, sans-serif;
      font-size: 16px;
      line-height: 1.2;
      font-weight: 500;
      padding: 10px 8px;
    }
    #sidebar .toggle-icon {
      color: #f2f4f8;
      font-size: 28px;
      font-weight: 500;
      line-height: 1;
    }
    #sidebar #sidebarToggle {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 52px;
      height: 52px;
      border-radius: 16px;
      margin: 0 0 8px auto;
      border: 1px solid rgba(255,255,255,0.25);
      background: rgba(255,255,255,0.06);
      color: #ffffff;
      font-size: 24px;
      cursor: pointer;
    }
    #sidebar #sidebarToggle i {
      pointer-events: none;
    }
    #sidebar #sidebarResetBottom {
      border: 1px solid rgba(255,255,255,0.3);
      color: #fff;
    }
  \`;
  document.head.appendChild(style);
};
ensureInlineStyle();

root.innerHTML = \`
  <div id="menu-demo-shell">
    <aside id="sidebar" class="sidebar scroll-area" style="height:92vh;">
      <div class="sidebar-header">
        <button id="sidebarToggle" type="button" title="Toggle sidebar">
          <i class="bi bi-chevron-left"></i>
        </button>
      </div>
      <div data-child="sidebarTree"></div>
      <div class="sidebar-footer">
        <button id="sidebarResetBottom" type="button" title="Reset"><i class="bi bi-arrow-clockwise"></i></button>
      </div>
    </aside>
  </div>
\`;

const toTitleLabel = (value) => {
  const text = String(value || "");
  const words = text
    .replace(/[_-]+/g, " ")
    .trim()
    .split(/\\s+/)
    .filter(Boolean);
  return words.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
};

const normalizeTreeData = (items) =>
  (Array.isArray(items) ? items : []).map((item) => ({
    ...item,
    name: toTitleLabel(item.name),
    children: normalizeTreeData(item.children)
  }));

const { initMenuTree } = api.uixMenu;
const { sidebar } = initMenuTree({
  data: normalizeTreeData(api.uixMenu.treeData),
  selectors: {
    sidebar: "#sidebar",
    mobile: "#__no_mobile_menu__"
  },
  callbacks: {
    onTabSelect: ({ tabId, name }) => {
      log(\`selected: \${name} (\${tabId})\`);
    }
  }
});

const sidebarToggleButton = document.getElementById("sidebarToggle");
if (sidebarToggleButton && sidebar) {
  sidebarToggleButton.addEventListener("click", () => sidebar.toggleSidebar());
}

const sidebarResetButton = document.getElementById("sidebarResetBottom");
if (sidebarResetButton && sidebar) {
  sidebarResetButton.addEventListener("click", () => sidebar.resetUiState());
}

log(\`sidebar ready: \${Boolean(sidebar)}\`);
log("mobile ready: false (disabled in this demo)");`;
