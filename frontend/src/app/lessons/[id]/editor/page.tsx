"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useQueryClient } from "@tanstack/react-query";
import { useLessonContext } from "@/lib/hooks/useLessonContext";
import { useRequireAuth } from "@/lib/hooks/useRequireAuth";
import { usePyodide } from "@/lib/hooks/usePyodide";
import { useAuthStore } from "@/lib/stores/authStore";
import api from "@/lib/api";

// Monaco must be client-only (no SSR)
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

// ─── Types ────────────────────────────────────────────────────────────────────

interface TestResult {
  input: string;
  expected_output: string;
  actual_output: string;
  passed: boolean;
  error?: string;
}

interface Task {
  id: number;
  title: string;
  description: string;
  starter_code: string;
  test_cases: Array<{ input: string; expected_output: string }>;
}

// ─── Pyodide loader screen ────────────────────────────────────────────────────

function PyodideLoader({ error }: { error: string | null }) {
  return (
    <div className="flex flex-col flex-1 items-center justify-center gap-6 px-6 py-16 text-center">
      {error ? (
        <>
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "rgba(239,68,68,0.15)" }}
          >
            <span className="text-red-400 text-2xl">✕</span>
          </div>
          <p className="text-red-400 font-semibold">Ошибка загрузки интерпретатора</p>
          <p className="text-white/40 text-sm max-w-sm">{error}</p>
        </>
      ) : (
        <>
          <div className="relative">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
              style={{ backgroundColor: "rgba(105,94,176,0.2)" }}
            >
              🐍
            </div>
            <div
              className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-t-transparent animate-spin"
              style={{ borderColor: "var(--color-accent-purple)" }}
            />
          </div>
          <div>
            <p className="text-white font-semibold text-lg mb-1">
              Загружаем интерпретатор Python...
            </p>
            <p className="text-white/40 text-sm max-w-xs">
              Это происходит один раз при первом заходе на практику.
              Дальше всё будет мгновенно.
            </p>
          </div>
          <div
            className="w-48 h-1 rounded-full overflow-hidden"
            style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
          >
            <div
              className="h-full rounded-full animate-pulse"
              style={{ width: "60%", backgroundColor: "var(--color-accent-purple)" }}
            />
          </div>
        </>
      )}
    </div>
  );
}

// ─── Test results panel ───────────────────────────────────────────────────────

function TestResultsPanel({
  results,
  stdout,
  stderr,
  aiHint,
}: {
  results: TestResult[] | null;
  stdout: string;
  stderr: string;
  aiHint: string | null;
}) {
  if (!results && !stdout && !stderr && !aiHint) return null;

  return (
    <div
      className="rounded-xl p-4 space-y-3"
      style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
    >
      <p className="text-xs font-bold uppercase tracking-widest text-white/40">Результат</p>

      {/* Raw output */}
      {(stdout || stderr) && !results && (
        <div className="font-mono text-sm space-y-1">
          {stdout && <pre className="text-green-400 whitespace-pre-wrap">{stdout}</pre>}
          {stderr && <pre className="text-red-400 whitespace-pre-wrap">{stderr}</pre>}
        </div>
      )}

      {/* Test case results */}
      {results && (
        <div className="space-y-2">
          {results.map((r, i) => (
            <div
              key={i}
              className="rounded-lg px-3 py-2.5 flex items-start gap-3"
              style={{
                backgroundColor: r.passed
                  ? "rgba(34,197,94,0.08)"
                  : "rgba(239,68,68,0.08)",
                border: `1px solid ${r.passed ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`,
              }}
            >
              <span className={`text-sm font-bold mt-0.5 ${r.passed ? "text-green-400" : "text-red-400"}`}>
                {r.passed ? "✓" : "✗"}
              </span>
              <div className="flex-1 text-xs space-y-1 font-mono">
                {r.input && (
                  <p className="text-white/50">Ввод: <span className="text-white/70">{r.input.trim()}</span></p>
                )}
                <p className="text-white/50">
                  Ожидалось: <span className="text-white/80">{r.expected_output}</span>
                </p>
                <p className="text-white/50">
                  Получено:{" "}
                  <span className={r.passed ? "text-green-300" : "text-red-300"}>
                    {r.actual_output || <em className="text-white/30">(пусто)</em>}
                  </span>
                </p>
                {r.error && <p className="text-red-400">{r.error}</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* AI hint block */}
      {aiHint && (
        <div
          className="text-sm"
          style={{
            background: "rgba(105,94,176,0.1)",
            borderLeft: "4px solid var(--color-accent-purple)",
            padding: "12px 16px",
            borderRadius: "8px",
            marginTop: "12px",
          }}
        >
          <p className="font-bold text-white mb-1">💡 Подсказка от ИИ:</p>
          <p className="text-white/80 leading-relaxed">{aiHint}</p>
        </div>
      )}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function LessonEditorPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const queryClient = useQueryClient();

  const { isInitialized } = useRequireAuth();
  const { lesson, theme, themeLessons, isLoading } = useLessonContext(id);
  const { isReady, isLoading: pyLoading, error: pyError, runCode } = usePyodide();

  const [code, setCode] = useState<string>("");
  const [stdout, setStdout] = useState("");
  const [stderr, setStderr] = useState("");
  const [testResults, setTestResults] = useState<TestResult[] | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [taskSource, setTaskSource] = useState<"ai" | "pool" | null>(null);
  const [remainingGenerations, setRemainingGenerations] = useState(3);
  const [justPassed, setJustPassed] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastCheckFailed, setLastCheckFailed] = useState(false);
  const [aiHint, setAiHint] = useState<string | null>(null);
  const [isLoadingHint, setIsLoadingHint] = useState(false);

  // Init code from lesson starter_code
  useEffect(() => {
    if (lesson && !currentTask) {
      setCode(lesson.starter_code || "# Напиши код здесь\n");
    }
  }, [lesson?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Redirect theory lessons to /lessons/[id]
  useEffect(() => {
    if (lesson?.lesson_type === "theory") {
      router.replace(`/lessons/${id}`);
    }
  }, [lesson, id, router]);

  // Next lesson info
  const currentIdx = themeLessons.findIndex((l) => l.id === Number(id));
  const nextLesson = currentIdx >= 0 ? themeLessons[currentIdx + 1] ?? null : null;
  const canProceed = justPassed || (lesson?.is_completed ?? false);

  // ── Check code ─────────────────────────────────────────────────────────────

  const handleCheck = useCallback(async () => {
    if (!lesson || isRunning) return;
    setIsRunning(true);
    setTestResults(null);
    setStdout("");
    setStderr("");

    try {
      // ── Task mode: send to backend ────────────────────────────────────────
      if (currentTask) {
        const { data } = await api.post(`/api/tasks/${currentTask.id}/check`, { code });
        setTestResults(data.test_results);
        if (data.is_correct) {
          setJustPassed(true);
          setLastCheckFailed(false);
          setAiHint(null);
        } else {
          setLastCheckFailed(true);
        }
        return;
      }

      // ── Lesson mode: run locally via Pyodide ─────────────────────────────
      if (!isReady) return;

      const tcs = lesson.test_cases ?? [];

      if (tcs.length === 0) {
        const result = await runCode(code, "");
        setStdout(result.stdout);
        setStderr(result.stderr);
        return;
      }

      const results: TestResult[] = [];
      let allPassed = true;

      for (const tc of tcs) {
        const result = await runCode(code, tc.input);
        const actual = result.stdout.trim();
        const expected = tc.expected_output.trim();
        const passed = actual === expected;
        if (!passed) allPassed = false;

        results.push({
          input: tc.input,
          expected_output: expected,
          actual_output: actual,
          passed,
          error: result.stderr || undefined,
        });
      }

      setTestResults(results);

      if (allPassed) {
        const { data } = await api.post(`/api/lessons/${id}/complete/`, { stars_earned: 3 });
        if (data.user) useAuthStore.setState({ user: data.user });
        queryClient.invalidateQueries({ queryKey: ["lesson", id] });
        queryClient.invalidateQueries({ queryKey: ["theme", lesson.theme] });
        queryClient.invalidateQueries({ queryKey: ["themes"] });
        setJustPassed(true);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Ошибка выполнения";
      setStderr(msg);
    } finally {
      setIsRunning(false);
    }
  }, [lesson, code, currentTask, isReady, runCode, id, queryClient, isRunning]);

  // ── Generate task via AI (async with polling) ───────────────────────────────

  const handleGenerateTask = async () => {
    if (!lesson || isGenerating) return;
    setIsGenerating(true);
    setLastCheckFailed(false);
    setAiHint(null);
    try {
      const { data } = await api.post("/api/tasks/generate", {
        theme_id: lesson.theme,
      });
      const celeryTaskId: string = data.task_id;

      // Poll every 1.5s, up to 40 attempts (60 seconds total)
      for (let i = 0; i < 40; i++) {
        await new Promise((r) => setTimeout(r, 1500));
        const { data: statusData } = await api.get(
          `/api/tasks/generate/status/${celeryTaskId}`
        );

        if (statusData.status === "success") {
          setCurrentTask(statusData.task as Task);
          setTaskSource(statusData.source);
          setRemainingGenerations(statusData.remaining_generations);
          setCode(statusData.task.starter_code || "# Напиши код здесь\n");
          setTestResults(null);
          setStdout("");
          setStderr("");
          return;
        }

        if (statusData.status === "failed") {
          alert(statusData.error || "Не удалось сгенерировать задание");
          if (statusData.remaining_generations !== undefined) {
            setRemainingGenerations(statusData.remaining_generations);
          }
          return;
        }
        // status === 'pending' — продолжаем polling
      }

      alert("Превышено время ожидания генерации");
    } catch {
      alert("Ошибка при генерации задания");
    } finally {
      setIsGenerating(false);
    }
  };

  // ── Get AI hint ─────────────────────────────────────────────────────────────

  const handleGetHint = async () => {
    if (!currentTask || isLoadingHint) return;
    setIsLoadingHint(true);
    try {
      const { data } = await api.post(`/api/tasks/${currentTask.id}/hint`, { code });
      setAiHint(data.hint);
    } catch {
      alert("Не удалось получить подсказку. Попробуй позже.");
    } finally {
      setIsLoadingHint(false);
    }
  };

  // ── Return to lesson ────────────────────────────────────────────────────────

  const handleReturnToLesson = () => {
    setCurrentTask(null);
    setTaskSource(null);
    setCode(lesson?.starter_code || "# Напиши код здесь\n");
    setTestResults(null);
    setStdout("");
    setStderr("");
    setLastCheckFailed(false);
    setAiHint(null);
  };

  // ── Navigate next ───────────────────────────────────────────────────────────

  const handleNext = () => {
    if (nextLesson) {
      router.push(
        nextLesson.lesson_type === "practice"
          ? `/lessons/${nextLesson.id}/editor`
          : `/lessons/${nextLesson.id}`
      );
    } else {
      router.push(`/topics/${theme?.id}`);
    }
  };

  // ── Guards ──────────────────────────────────────────────────────────────────

  if (!isInitialized || isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent border-white/40 animate-spin" />
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-[60vh]">
        <p className="text-white/40">Урок не найден</p>
      </div>
    );
  }

  if (pyLoading && !currentTask) {
    return <PyodideLoader error={pyError} />;
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col flex-1 px-4 lg:px-6 py-6 gap-4 w-full">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex flex-col gap-1">
          <h1
            className="text-xl sm:text-2xl font-black text-white leading-tight"
            style={{ fontFamily: "'Science Gothic', sans-serif" }}
          >
            {currentTask ? "Задание" : `Урок ${lesson.order}. ${lesson.title}`}
          </h1>
          {lesson.is_completed && !justPassed && (
            <span className="text-xs text-green-400 font-semibold">✓ Урок пройден</span>
          )}
          {justPassed && (
            <span className="text-xs text-green-400 font-semibold">✓ Отлично! Все тесты прошли</span>
          )}
        </div>

        {currentTask && (
          <button
            onClick={handleReturnToLesson}
            className="text-sm px-3 py-1.5 rounded-lg transition-colors hover:bg-white/10"
            style={{ color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            ← Вернуться к уроку
          </button>
        )}
      </div>

      {/* ── Task source badge ───────────────────────────────────────────────── */}
      {taskSource && (
        <div
          className="inline-flex items-center gap-1.5 self-start px-3 py-1 rounded-full text-xs font-semibold"
          style={
            taskSource === "ai"
              ? { backgroundColor: "rgba(105,94,176,0.15)", color: "var(--color-accent-purple-light)", border: "1px solid rgba(105,94,176,0.3)" }
              : { backgroundColor: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.12)" }
          }
        >
          {taskSource === "ai" ? "🤖 Задание сгенерировано ИИ" : "📦 Задание из пула"}
        </div>
      )}

      {/* ── Generating overlay message ──────────────────────────────────────── */}
      {isGenerating && (
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm"
          style={{ backgroundColor: "rgba(105,94,176,0.1)", border: "1px solid rgba(105,94,176,0.25)" }}
        >
          <span className="w-4 h-4 rounded-full border-2 border-t-transparent border-purple-400 animate-spin shrink-0" />
          <span className="text-white/70">Генерируем задание через ИИ, подождите...</span>
        </div>
      )}

      {/* ── Task / lesson description ───────────────────────────────────────── */}
      {currentTask ? (
        <div
          className="rounded-xl px-4 py-3"
          style={{ backgroundColor: "rgba(105,94,176,0.1)", border: "1px solid rgba(105,94,176,0.25)" }}
        >
          <p className="text-sm font-bold text-white mb-1">{currentTask.title}</p>
          <p className="text-sm text-white/70">{currentTask.description}</p>
        </div>
      ) : (
        lesson.content?.markdown && (
          <div
            className="rounded-xl px-4 py-3 text-sm text-white/70 leading-relaxed"
            style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            {lesson.content.markdown
              .replace(/^#+\s+/gm, "")
              .replace(/`{1,3}[^`]*`{1,3}/g, "")
              .replace(/\*{1,2}([^*]+)\*{1,2}/g, "$1")
              .split("\n")
              .filter(Boolean)
              .slice(0, 3)
              .join(" ")
              .slice(0, 220)}
            {lesson.content.markdown.length > 220 && "…"}
          </div>
        )
      )}

      {/* ── Monaco Editor ──────────────────────────────────────────────────── */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ border: "1px solid rgba(255,255,255,0.1)" }}
      >
        <div
          className="flex items-center gap-2 px-3 py-1.5"
          style={{ backgroundColor: "#1e1e2e", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <span className="text-xs text-white/30 font-mono">main.py</span>
          <span className="ml-auto text-xs text-white/20">Python 3</span>
        </div>
        <MonacoEditor
          height="340px"
          defaultLanguage="python"
          theme="vs-dark"
          value={code}
          onChange={(val) => setCode(val ?? "")}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            lineNumbers: "on",
            renderLineHighlight: "gutter",
            padding: { top: 12, bottom: 12 },
            fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
            fontLigatures: true,
          }}
        />
      </div>

      {/* ── Results panel ──────────────────────────────────────────────────── */}
      <TestResultsPanel results={testResults} stdout={stdout} stderr={stderr} aiHint={aiHint} />

      {/* ── Action buttons ──────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 flex-wrap mt-auto">
        {/* Check / Verify */}
        <button
          onClick={handleCheck}
          disabled={isRunning || (!isReady && !currentTask)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ backgroundColor: "var(--color-accent-purple)", color: "#FFFFFF" }}
        >
          {isRunning ? (
            <>
              <span className="w-3.5 h-3.5 rounded-full border-2 border-t-transparent border-white animate-spin" />
              Проверка...
            </>
          ) : (
            "▶ Проверить"
          )}
        </button>

        {/* AI Hint — only when task active and last check failed */}
        {currentTask && lastCheckFailed && (
          <button
            onClick={handleGetHint}
            disabled={isLoadingHint}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              backgroundColor: "rgba(105,94,176,0.12)",
              color: "var(--color-accent-purple-light)",
              border: "1px solid rgba(105,94,176,0.3)",
            }}
          >
            {isLoadingHint ? (
              <span className="w-3.5 h-3.5 rounded-full border-2 border-t-transparent border-purple-400 animate-spin" />
            ) : (
              "💡"
            )}
            Получить подсказку
          </button>
        )}

        {/* Generate task */}
        <button
          onClick={handleGenerateTask}
          disabled={isGenerating || isRunning}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            backgroundColor: "rgba(255,219,58,0.1)",
            color: "var(--color-accent-yellow)",
            border: "1px solid rgba(255,219,58,0.25)",
          }}
        >
          {isGenerating ? (
            <span className="w-3.5 h-3.5 rounded-full border-2 border-t-transparent border-yellow-400 animate-spin" />
          ) : (
            "✦"
          )}
          Генерация задания ({remainingGenerations})
        </button>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Next */}
        <button
          onClick={handleNext}
          disabled={!canProceed}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-opacity hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed"
          style={{ backgroundColor: "var(--color-accent-yellow)", color: "#0C0827" }}
        >
          {!nextLesson ? "Завершить тему" : "Дальше →"}
        </button>
      </div>
    </div>
  );
}
