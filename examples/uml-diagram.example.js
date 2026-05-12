export const id = "uml-diagram";
export const title = "UML Diagram (real)";
export const externals = "uixUML=https://cdn.jsdelivr.net/gh/alikzao/uix-uml@8c275648676a2fec71a256b99332a36a3d3492a5/dist/uix-uml.esm.js";

export const code = `const ensureStylesheet = (href, marker) => {
  if (document.querySelector('link[' + marker + '][href="' + href + '"]')) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  link.setAttribute(marker, "true");
  document.head.appendChild(link);
};

const ensureScript = (src, marker) =>
  new Promise((resolve, reject) => {
    if (window.d3) {
      resolve();
      return;
    }

    const existing = document.querySelector('script[' + marker + '][src="' + src + '"]');
    if (existing) {
      existing.addEventListener("load", resolve, { once: true });
      existing.addEventListener("error", reject, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.setAttribute(marker, "true");
    script.onload = resolve;
    script.onerror = () => reject(new Error("Failed to load " + src));
    document.head.appendChild(script);
  });

ensureStylesheet("https://cdn.jsdelivr.net/gh/alikzao/uix-uml@8c275648676a2fec71a256b99332a36a3d3492a5/dist/uix-uml.css?v=8c27564", "data-uix-uml-style");
await ensureScript("https://cdn.jsdelivr.net/npm/d3@7/dist/d3.min.js", "data-uix-d3");

window.config = { isDev: true };
window.io = window.io || function () {
  return {
    onAny() {},
    on() {},
    off() {},
    emit() {}
  };
};
window.t = window.t || function (key) { return key; };
window.i18n = window.i18n || function (value) {
  return typeof value === "object" ? (value.en || value.ru || "") : value;
};

const demoData = {
  status: "ok",
  pipeId: "playground-pipe",
  maps: {
    nodes: [
      {
        id: "webhook",
        label: "Webhook Trigger",
        type: "trigger",
        triggerTypes: "external",
        sort: 0,
        fields: [
          { id: "payload", label: "Incoming payload", type: "object" },
          { id: "customer_id", label: "Customer ID", type: "string" }
        ]
      },
      {
        id: "order",
        label: "Create Order",
        type: "action_group",
        sort: 1,
        fields: [
          { id: "order_id", label: "Order ID", type: "string" },
          {
            id: "items",
            label: "Line items",
            type: "array",
            children: [
              { id: "sku", label: "SKU", type: "string" },
              { id: "qty", label: "Quantity", type: "number" }
            ]
          },
          { id: "total", label: "Total amount", type: "number" }
        ]
      },
      {
        id: "validate",
        label: "Validate Stock",
        type: "action_group",
        sort: 2,
        fields: [
          { id: "sku", label: "SKU", type: "string" },
          { id: "available", label: "Available", type: "boolean" },
          { id: "reservation_id", label: "Reservation ID", type: "string" }
        ]
      },
      {
        id: "invoice",
        label: "Generate Invoice",
        type: "action_group",
        sort: 3,
        fields: [
          { id: "invoice_id", label: "Invoice ID", type: "string" },
          {
            id: "totals",
            label: "Totals",
            type: "object",
            children: [
              { id: "subtotal", label: "Subtotal", type: "number" },
              { id: "tax", label: "Tax", type: "number" },
              { id: "grand_total", label: "Grand total", type: "number" }
            ]
          },
          { id: "pdf_url", label: "PDF URL", type: "string" }
        ]
      },
      {
        id: "notify",
        label: "Send Notification",
        type: "trigger",
        triggerTypes: "internal",
        sort: 4,
        fields: [
          { id: "email", label: "Email", type: "string" },
          { id: "message", label: "Message", type: "text" }
        ]
      }
    ],
    links: [
      {
        source: { node: "webhook", field: "payload" },
        target: { node: "order", field: "order_id" }
      },
      {
        source: { node: "order", field: "items", sub: "sku" },
        target: { node: "validate", field: "sku" }
      },
      {
        source: { node: "validate", field: "reservation_id" },
        target: { node: "invoice", field: "invoice_id" }
      },
      {
        source: { node: "invoice", field: "pdf_url" },
        target: { node: "notify", field: "message" }
      },
      {
        source: { node: "webhook", field: "customer_id" },
        target: { node: "notify", field: "email" }
      }
    ]
  }
};

window.req = async function (url) {
  if (url === "/get/list/maps") return demoData;
  return { status: "ok", id: "playground-" + Date.now() };
};

root.innerHTML = '<main id="content-workflow"><div id="uml-playground"></div></main>';

api.uixUML.initializeUMLSocket({ userId: "playground-user" });

const diagram = new api.uixUML.UML("#uml-playground", {
  data: { id: "playground-pipe" },
  popupKeys: {},
  linkKeys: { api: "link.api.uml" }
});

await diagram.initState({ data: demoData });
log("UML playground diagram ready.");
`;
