import Split from "split.js";
import "./app.css";

const playgroundRoot = new URL("../", import.meta.url);
const examplesUrl = new URL("./examples/index.js", playgroundRoot).href;
const runnerBaseUrl = new URL("./runner.html", playgroundRoot).href;
const monacoLoaderUrl = new URL("./vendor/monaco/vs/loader.js", playgroundRoot).href;
const monacoVsPath = new URL("./vendor/monaco/vs", playgroundRoot).href;

const { examples, examplesById, defaultExampleId } = await import(examplesUrl);

const editorHost = document.getElementById("editor");
const editorFallback = document.getElementById("editorFallback");
const select = document.getElementById("exampleSelect");
const externalsInput = document.getElementById("externalsInput");
const runBtn = document.getElementById("runBtn");
const resetBtn = document.getElementById("resetBtn");
const clearLogsBtn = document.getElementById("clearLogsBtn");
const frame = document.getElementById("preview");
const status = document.getElementById("status");
const logs = document.getElementById("logs");
const bootOverlay = document.getElementById("bootOverlay");
const bootLabel = document.getElementById("bootLabel");
const topRegion = document.getElementById("topRegion");
const codePane = document.getElementById("codePane");
const resultPane = document.getElementById("resultPane");
const logsPane = document.getElementById("logsPane");

let monacoEditor = null;
let isFallbackEditor = false;
let bindingDecorationIds = [];
let currentRunId = "";
let runTimeoutId = null;
let initialRunStarted = false;
let initialRunCompleted = false;
let runnerReady = false;
let pendingRun = false;

const params = new URLSearchParams(window.location.search);
const requestedExample = params.get("example");
let currentKey = examplesById[requestedExample] ? requestedExample : defaultExampleId;
let initialCode = examplesById[currentKey].code;
let initialExternals = examplesById[currentKey].externals || "";

const setEditorValue = (value) => {
  if (monacoEditor) {
    monacoEditor.setValue(value);
    return;
  }
  editorFallback.value = value;
};

const getEditorValue = () => {
  if (monacoEditor) {
    return monacoEditor.getValue();
  }
  return editorFallback.value;
};

const setExternalsValue = (value) => {
  externalsInput.value = value || "";
};

const showWarmEditor = () => {
  editorFallback.classList.remove("hidden");
  editorFallback.value = initialCode;
};

const setStatus = (text, mode = "") => {
  status.textContent = text;
  status.className = `status ${mode}`.trim();
};

const showFallbackEditor = () => {
  isFallbackEditor = true;
  editorHost.style.display = "none";
  editorFallback.classList.remove("hidden");
  editorFallback.value = initialCode;
  setStatus("editor fallback mode", "err");
};

const loadMonaco = async () => {
  if (window.monaco && window.require) {
    return window.monaco;
  }
  await new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = monacoLoaderUrl;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
  return await new Promise((resolve, reject) => {
    window.require.config({
      paths: {
        vs: monacoVsPath
      }
    });
    window.require(["vs/editor/editor.main"], () => resolve(window.monaco), reject);
  });
};

const initEditor = async () => {
  showWarmEditor();
  try {
    const monaco = await loadMonaco();
    monacoEditor = monaco.editor.create(editorHost, {
      value: initialCode,
      language: "javascript",
      theme: "vs-dark",
      automaticLayout: true,
      fontSize: 13,
      minimap: { enabled: false },
      scrollBeyondLastLine: false
    });
    const updateEventBindingHighlights = () => {
      const model = monacoEditor.getModel();
      if (!model) return;
      const text = model.getValue();
      const decorations = [];
      const tokenRegex = /\b(data-[a-zA-Z0-9-]+|on[A-Z][a-zA-Z0-9]*)\s*=\s*("([^"]*)"|'([^']*)')/g;

      for (const match of text.matchAll(tokenRegex)) {
        if (typeof match.index !== "number") continue;
        const full = match[0];
        const attrName = match[1];
        const attrOffsetInFull = full.indexOf(attrName);
        const valueWithQuotes = match[2];
        const valueOffsetInFull = full.indexOf(valueWithQuotes);
        const valueInnerStartInFull = valueOffsetInFull + 1;
        const valueInnerEndInFull = valueOffsetInFull + valueWithQuotes.length - 1;

        const attrStartOffset = match.index + attrOffsetInFull;
        const attrEndOffset = attrStartOffset + attrName.length;
        const attrStart = model.getPositionAt(attrStartOffset);
        const attrEnd = model.getPositionAt(attrEndOffset);

        decorations.push({
          range: new monaco.Range(attrStart.lineNumber, attrStart.column, attrEnd.lineNumber, attrEnd.column),
          options: {
            inlineClassName: "uix-attr-token",
            hoverMessage: { value: "UIX attribute" }
          }
        });

        if (valueInnerEndInFull > valueInnerStartInFull) {
          const valueStartOffset = match.index + valueInnerStartInFull;
          const valueEndOffset = match.index + valueInnerEndInFull;
          const valueStart = model.getPositionAt(valueStartOffset);
          const valueEnd = model.getPositionAt(valueEndOffset);

          decorations.push({
            range: new monaco.Range(valueStart.lineNumber, valueStart.column, valueEnd.lineNumber, valueEnd.column),
            options: {
              inlineClassName: "uix-attr-value-token",
              hoverMessage: { value: "UIX attribute value" }
            }
          });
        }
      }

      bindingDecorationIds = monacoEditor.deltaDecorations(bindingDecorationIds, decorations);
    };

    monacoEditor.onDidChangeModelContent(updateEventBindingHighlights);
    updateEventBindingHighlights();
    editorFallback.classList.add("hidden");
  } catch (_error) {
    showFallbackEditor();
  }
};

const layoutEditor = () => {
  if (monacoEditor) {
    monacoEditor.layout();
  }
};

for (const example of examples) {
  const opt = document.createElement("option");
  opt.value = example.id;
  opt.textContent = example.title;
  select.appendChild(opt);
}

const setBootMessage = (text) => {
  bootLabel.textContent = text;
};

const hideBootOverlay = () => {
  if (initialRunCompleted) {
    return;
  }
  initialRunCompleted = true;
  document.body.classList.remove("booting");
  bootOverlay.classList.add("hidden");
};

const clearLogs = () => {
  logs.textContent = "";
};

const addLog = (line) => {
  logs.textContent += `${line}\n`;
  logs.parentElement.scrollTop = logs.parentElement.scrollHeight;
};

const loadRunner = () => {
  runnerReady = false;
  setBootMessage("Loading sandbox...");
  const runnerUrl = new URL(runnerBaseUrl);
  runnerUrl.searchParams.set("reload", String(Date.now()));
  frame.src = runnerUrl.href;
};

const parseExternals = (raw) => {
  if (!raw || !raw.trim()) return [];
  return raw
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .map((pair) => {
      const separatorIndex = pair.indexOf("=");
      if (separatorIndex <= 0 || separatorIndex >= pair.length - 1) {
        throw new Error(`Invalid external format: "${pair}". Use Name=url`);
      }
      const name = pair.slice(0, separatorIndex).trim();
      const url = pair.slice(separatorIndex + 1).trim();
      if (!/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(name)) {
        throw new Error(`Invalid external name: "${name}"`);
      }
      return { name, url };
    });
};

const run = () => {
  if (!runnerReady) {
    pendingRun = true;
    setBootMessage("Preparing preview...");
    setStatus("runner loading...");
    return;
  }
  pendingRun = false;
  initialRunStarted = true;
  setBootMessage("Running example...");
  clearLogs();
  currentRunId = `run-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  if (runTimeoutId) {
    clearTimeout(runTimeoutId);
  }
  let externals = [];
  try {
    externals = parseExternals(externalsInput.value);
  } catch (error) {
    setStatus(error.message || "invalid externals", "err");
    addLog(String(error.message || error));
    return;
  }
  frame.contentWindow.postMessage(
    { type: "uix:run", code: getEditorValue(), runId: currentRunId, externals },
    window.location.origin
  );
  runTimeoutId = window.setTimeout(() => {
    setStatus("execution timeout, runner restarted", "err");
    pendingRun = true;
    loadRunner();
  }, 2500);
  setStatus("running...");
};

select.value = currentKey;

select.addEventListener("change", () => {
  currentKey = select.value;
  initialCode = examplesById[currentKey].code;
  initialExternals = examplesById[currentKey].externals || "";
  setEditorValue(initialCode);
  setExternalsValue(initialExternals);
  const nextUrl = `${window.location.pathname}?example=${encodeURIComponent(currentKey)}`;
  window.history.replaceState(null, "", nextUrl);
  run();
});

runBtn.addEventListener("click", run);
resetBtn.addEventListener("click", () => {
  initialCode = examplesById[currentKey].code;
  initialExternals = examplesById[currentKey].externals || "";
  setEditorValue(initialCode);
  setExternalsValue(initialExternals);
  run();
});
clearLogsBtn.addEventListener("click", clearLogs);

const initSplitLayout = () => {
  if (window.innerWidth <= 980) {
    return;
  }

  if (typeof Split !== "function") {
    setStatus("split unavailable", "err");
    return;
  }

  Split([codePane, resultPane], {
    sizes: [50, 50],
    minSize: [220, 220],
    gutterSize: 6,
    direction: "horizontal",
    onDrag: () => {
      layoutEditor();
    }
  });

  Split([topRegion, logsPane], {
    sizes: [84, 16],
    minSize: [180, 130],
    gutterSize: 6,
    direction: "vertical",
    onDrag: () => {
      layoutEditor();
    }
  });
};

window.addEventListener("resize", () => {
  layoutEditor();
});

window.addEventListener("message", (event) => {
  if (event.origin !== window.location.origin) return;
  if (event.source !== frame.contentWindow) return;
  if (!event.data) return;
  if (event.data.type === "uix:ready") {
    runnerReady = true;
    if (pendingRun || !initialRunStarted) {
      run();
    }
    return;
  }
  if (event.data.type === "uix:status") {
    if (event.data.runId !== currentRunId) return;
    if (runTimeoutId) {
      clearTimeout(runTimeoutId);
      runTimeoutId = null;
    }
    if (event.data.ok) {
      setStatus("ok", "ok");
    } else {
      setStatus(event.data.error || "runtime error", "err");
    }
    hideBootOverlay();
    return;
  }
  if (event.data.type === "uix:log") {
    if (event.data.runId !== currentRunId) return;
    addLog(event.data.message || "");
  }
});

setExternalsValue(initialExternals);
pendingRun = true;
loadRunner();
await initEditor();
initSplitLayout();
if (isFallbackEditor) {
  setEditorValue(initialCode);
}
