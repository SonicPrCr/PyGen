importScripts("https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js");

let pyodide = null;

async function initPyodide() {
  if (pyodide) return;
  pyodide = await loadPyodide();
}

self.onmessage = async (event) => {
  const { type, code, stdin, id } = event.data;

  if (type === "init") {
    try {
      await initPyodide();
      self.postMessage({ type: "ready", id });
    } catch (e) {
      self.postMessage({ type: "error", error: e.message, id });
    }
    return;
  }

  if (type === "run") {
    try {
      await initPyodide();

      // Reset stdout / stderr
      pyodide.runPython(`
import sys, io
sys.stdout = io.StringIO()
sys.stderr = io.StringIO()
`);

      // Inject stdin if provided
      if (stdin) {
        pyodide.runPython(`sys.stdin = io.StringIO(${JSON.stringify(stdin)})`);
      } else {
        pyodide.runPython(`sys.stdin = io.StringIO("")`);
      }

      await pyodide.runPythonAsync(code);

      const stdout = pyodide.runPython("sys.stdout.getvalue()");
      const stderr = pyodide.runPython("sys.stderr.getvalue()");

      self.postMessage({ type: "result", stdout, stderr, id });
    } catch (e) {
      const stderr = (() => {
        try { return pyodide.runPython("sys.stderr.getvalue()"); } catch { return ""; }
      })();
      self.postMessage({
        type: "result",
        stdout: "",
        stderr: stderr || e.message,
        id,
      });
    }
  }
};
