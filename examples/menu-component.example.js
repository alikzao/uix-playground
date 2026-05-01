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

root.innerHTML = \`
  <div class="nav1">
    <button class="burger" type="button">
      <span></span><span></span><span></span>
    </button>
    <div class="nav-links"></div>
  </div>
  <aside id="sidebar" style="height:100vh; overflow:auto; border-right:1px solid #ddd;"></aside>
\`;

const { initMenuTree } = api.uixMenu;
const { sidebar, mobile } = initMenuTree({
  selectors: {
    sidebar: "#sidebar",
    mobile: ".nav1",
    burger: ".burger",
    navLinks: ".nav-links"
  },
  callbacks: {
    onTabSelect: ({ tabId, name }) => {
      log(\`selected: \${name} (\${tabId})\`);
    }
  }
});

log(\`sidebar ready: \${Boolean(sidebar)}\`);
log(\`mobile ready: \${Boolean(mobile)}\`);`;

