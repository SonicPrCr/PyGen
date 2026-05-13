"use client";

import { useEffect, useRef, useState, useCallback } from "react";

export interface RunResult {
  stdout: string;
  stderr: string;
}

export function usePyodide() {
  const workerRef = useRef<Worker | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const worker = new Worker("/pyodide-worker.js");
    workerRef.current = worker;

    const onMessage = (e: MessageEvent) => {
      if (e.data.type === "ready") {
        setIsReady(true);
        setIsLoading(false);
      } else if (e.data.type === "error") {
        setError(e.data.error ?? "Ошибка инициализации Pyodide");
        setIsLoading(false);
      }
    };

    worker.addEventListener("message", onMessage);
    worker.postMessage({ type: "init" });

    return () => {
      worker.removeEventListener("message", onMessage);
      worker.terminate();
    };
  }, []);

  const runCode = useCallback(
    (code: string, stdin = ""): Promise<RunResult> => {
      return new Promise((resolve, reject) => {
        const worker = workerRef.current;
        if (!worker || !isReady) {
          reject(new Error("Pyodide ещё не готов"));
          return;
        }

        const id = Math.random().toString(36).slice(2);

        // Kill worker and reject if code runs > 10 sec (infinite loop guard)
        const timer = setTimeout(() => {
          worker.terminate();
          workerRef.current = null;
          setIsReady(false);
          setIsLoading(false);
          reject(new Error("Превышено время выполнения (10 сек). Возможно, бесконечный цикл."));
        }, 10_000);

        const onResult = (e: MessageEvent) => {
          if (e.data.id === id && e.data.type === "result") {
            clearTimeout(timer);
            worker.removeEventListener("message", onResult);
            resolve({ stdout: e.data.stdout ?? "", stderr: e.data.stderr ?? "" });
          }
        };

        worker.addEventListener("message", onResult);
        worker.postMessage({ type: "run", code, stdin, id });
      });
    },
    [isReady]
  );

  return { isReady, isLoading, error, runCode };
}
