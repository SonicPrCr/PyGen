"use client";

import { useState } from "react";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { ChevronDown } from "lucide-react";

const FAQ_ITEMS = [
  {
    question: "Этот курс бесплатный?",
    answer:
      "Да, этот курс абсолютно бесплатный и доступен всем желающим без подписок и пробного периода.",
  },
  {
    question: "Как проходит обучение?",
    answer:
      "Курс состоит из тем, каждая из которых содержит теоретические и практические уроки. Теория объясняет концепции, а практика позволяет закрепить знания в встроенном редакторе кода. Следующая тема открывается после полного прохождения текущей.",
  },
  {
    question: "Что нужно чтобы пройти курс?",
    answer:
      "Достаточно браузера и желания учиться. Устанавливать Python или другие программы не нужно — код запускается прямо в браузере.",
  },
  {
    question: "Как работает система заданий с ИИ?",
    answer:
      "На практических уроках доступна кнопка «Генерация задания». При нажатии искусственный интеллект создаёт уникальное задание по теме урока. На каждую тему доступно 3 ИИ-генерации, после чего задания берутся из готового пула. При ошибке можно получить подсказку от ИИ.",
  },
  {
    question: "Что такое XP и уровни?",
    answer:
      "За прохождение каждого урока начисляются очки опыта (XP) и звёзды. XP накапливается и повышает уровень: для перехода на уровень N нужно N×100 очков. Уровни и достижения отображаются в профиле.",
  },
];

function FaqItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-5 text-left transition-colors hover:text-white/90"
        style={{ color: isOpen ? "#FFFFFF" : "rgba(255,255,255,0.75)" }}
      >
        <span className="font-semibold text-base pr-8">{question}</span>
        <ChevronDown
          size={20}
          className="shrink-0 transition-transform duration-200"
          style={{
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            color: isOpen ? "var(--color-accent-yellow)" : "rgba(255,255,255,0.35)",
          }}
        />
      </button>
      {isOpen && (
        <div
          className="pb-5 text-sm leading-relaxed"
          style={{ color: "rgba(255,255,255,0.6)" }}
        >
          {answer}
        </div>
      )}
    </div>
  );
}

export default function HelpPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "var(--color-bg-primary)" }}
    >
      <Header />

      <main className="flex-1 px-4 sm:px-6 lg:px-16 py-10 sm:py-14">
        <div className="max-w-3xl mx-auto">
          <h1
            className="text-3xl sm:text-4xl font-bold text-white mb-10"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Самые частые вопросы
          </h1>

          <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }} />

          <div>
            {FAQ_ITEMS.map((item, i) => (
              <FaqItem
                key={i}
                question={item.question}
                answer={item.answer}
                isOpen={openIdx === i}
                onToggle={() => setOpenIdx(openIdx === i ? null : i)}
              />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
