import Image from "next/image";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { StartFreeBtn } from "@/components/landing/StartFreeBtn";

// ─── Данные ───────────────────────────────────────────────────────────────────

const HERO_BULLETS = [
  "Всегда новые задачи — как и на работе.",
  "Виртуальный ИИ помощник, который направляет.",
  "Весь курс — бесплатно.",
];

const PLATFORM_FEATURES = [
  {
    title: "Редактор кода",
    description:
      "Пишите и запускайте код в браузере с любого устройства. Всё отлично работает без лишних настроек.",
  },
  {
    title: "Теория",
    description:
      "Вся необходимая информация без лишней воды — 10 тем и 100 уроков для полного понимания основ Python.",
  },
  {
    title: "Проверка задания",
    description:
      "ИИ генерирует и проверяет задания, написанные под текущую тему урока.",
  },
  {
    title: "Геймификация обучения",
    description:
      "Повышай уровень с помощью опыта, полученного за прохождение уроков.",
  },
];

const REVIEWS = [
  {
    name: "Алексей К.",
    text: "Начал с нуля - теперь пишу собственные скрипты для автоматизации. Задачи каждый раз разные, нельзя просто «зазубрить» ответ, приходится реально думать.",
  },
  {
    name: "Марина В.",
    text: "Сначала думала: бесплатно - значит плохо. Ошиблась. ИИ-помощник объясняет ошибки понятнее, чем некоторые преподаватели. Прошла уже половину курса.",
  },
  {
    name: "Дмитрий Н.",
    text: "Пробовал несколько платформ. Здесь задачи генерируются заново каждый раз - нельзя просто найти решение в интернете. Это честнее и эффективнее.",
  },
  {
    name: "Ольга С.",
    text: "Редактор прямо в браузере - ничего устанавливать не нужно. Прошла 4 темы и чувствую реальный прогресс. Для новичков - отличный старт.",
  },
  {
    name: "Тимур Х.",
    text: "Геймификация неожиданно работает. Слежу за своим уровнем и хочу его повысить. Именно это и заставляет садиться за уроки каждый день.",
  },
  {
    name: "Екатерина Л.",
    text: "Проверка мгновенная, объяснение всегда по делу. Наконец-то разобралась с циклами и списками - раньше казалось, что это сложно.",
  },
  {
    name: "Иван П.",
    text: "Теория короткая и без воды, задачи сразу закрепляют материал. Рекомендую всем, кто не хочет тратить месяцы на введение в программирование.",
  },
  {
    name: "Анастасия Р.",
    text: "Пробовала видеоуроки - не моё. Здесь сразу пишешь код и видишь результат. За две недели узнала больше, чем за месяц просмотра роликов.",
  },
];

// ─── Страница ─────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <>
      <Header />
      <HeroSection />
      <ProblemSection />
      <PlatformSection />
      <QualitySection />
      <ReviewsSection />
      <Footer />
    </>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section className="px-4 sm:px-6 lg:px-16 pt-10 sm:pt-14 lg:pt-20 pb-12 sm:pb-16 lg:pb-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        {/* Текстовый блок */}
        <div>
          <h1
            className="text-[40px] sm:text-[44px] lg:text-[48px] font-bold leading-tight mb-5"
            style={{
              fontFamily: "var(--font-heading), sans-serif",
              color: "#F0F0F0",
            }}
          >
            Python для новичков
          </h1>

          <p
            className="text-[18px] sm:text-[20px] lg:text-[24px] font-semibold mb-8 leading-relaxed"
            style={{ color: "#F0F0F0" }}
          >
            Тренажёр, который учит нестандартно мыслить, а не искать готовые
            ответы.
          </p>

          <ul className="flex flex-col gap-3 sm:gap-4 mb-10">
            {HERO_BULLETS.map((text) => (
              <li key={text} className="flex items-center gap-3">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: "var(--color-accent-purple)" }}
                />
                <span
                  className="text-[16px] sm:text-[18px] lg:text-[20px] font-bold"
                  style={{ color: "#F0F0F0" }}
                >
                  {text}
                </span>
              </li>
            ))}
          </ul>

          <StartFreeBtn fullWidthMobile />
        </div>

        {/* Изображение редактора */}
        <div className="mt-4 lg:mt-0">
          <Image
            src="/images/landing/code-preview.png"
            alt="Редактор кода PyGen"
            width={700}
            height={450}
            priority
            className="w-full rounded-xl"
            style={{ boxShadow: "0 0 40px rgba(105,94,176,0.4)" }}
          />
        </div>
      </div>
    </section>
  );
}

// ─── Задачи, меняющие мышление ────────────────────────────────────────────────

function ProblemSection() {
  return (
    <section
      className="relative overflow-hidden py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-16"
      style={{
        background: "linear-gradient(180deg, #524496 0%, #8A7BE9 100%)",
      }}
    >
      {/* Декоративные шестерёнки */}
      <img
        src="/images/landing/subtract.svg"
        aria-hidden
        alt=""
        className="absolute -left-20 sm:-left-32 lg:-left-40 -bottom-20 sm:-bottom-28 lg:-bottom-32 w-64 sm:w-80 lg:w-[420px] pointer-events-none select-none"
        style={{ opacity: 0.18 }}
      />
      <img
        src="/images/landing/subtract.svg"
        aria-hidden
        alt=""
        className="absolute -right-16 sm:-right-24 lg:-right-32 -top-10 sm:-top-16 lg:-top-20 w-48 sm:w-64 lg:w-80 pointer-events-none select-none"
        style={{ opacity: 0.15 }}
      />
      <div className="relative z-10 max-w-7xl mx-auto">
        <h2
          className="text-[32px] sm:text-[40px] lg:text-[48px] font-bold text-center mb-10 sm:mb-14"
          style={{
            fontFamily: "var(--font-heading), sans-serif",
            color: "#F0F0F0",
          }}
        >
          Задачи, меняющие мышление
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Левый блок — проблема */}
          <p
            className="text-[16px] sm:text-[18px] lg:text-[20px] font-semibold leading-relaxed"
            style={{ color: "#F0F0F0" }}
          >
            Подготовленные заранее задачи хоть и имеют множество решений в
            программировании, но при этом лишают опыта нестандартного мышления —
            что очень важно для каждого программиста. Важно уметь
            экспериментировать и искать собственные решения тех или иных
            проблем.
          </p>

          {/* Правый блок — решение + стрелка */}
          <div className="flex flex-col gap-5">
            <p
              className="text-[18px] sm:text-[20px] lg:text-[24px] font-bold leading-snug"
              style={{ color: "#F0F0F0" }}
            >
              Поэтому мы предлагаем решение: генерацию новых задач
            </p>
            <p
              className="text-[15px] sm:text-[17px] lg:text-[18px] font-semibold leading-relaxed"
              style={{ color: "#F0F0F0" }}
            >
              Которые позволят обучиться не только основам программирования, но
              и разовьют навык нестандартного мышления.
            </p>

            {/* Декоративная стрелка */}
            {/* <div className="flex justify-end mt-2">
              <Image
                src="/images/landing/vector-3.svg"
                alt=""
                width={120}
                height={97}
                aria-hidden
              />
            </div> */}
          </div>
        </div>

        {/* Кнопка */}
        <div className="flex justify-center mt-10 sm:mt-12">
          <StartFreeBtn />
        </div>
      </div>
    </section>
  );
}

// ─── Доступность и качество ───────────────────────────────────────────────────

function QualitySection() {
  return (
    <section
      className="relative overflow-hidden py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-16"
      style={{
        background: "linear-gradient(180deg, #524496 0%, #8A7BE9 100%)",
      }}
    >
      {/* Декоративные шестерёнки */}
      <img
        src="/images/landing/subtract.svg"
        aria-hidden
        alt=""
        className="absolute -right-20 sm:-right-32 lg:-right-40 -bottom-20 sm:-bottom-28 lg:-bottom-32 w-64 sm:w-80 lg:w-[420px] pointer-events-none select-none"
        style={{ opacity: 0.18 }}
      />
      <img
        src="/images/landing/subtract.svg"
        aria-hidden
        alt=""
        className="absolute -left-16 sm:-left-24 lg:-left-32 -top-10 sm:-top-16 lg:-top-20 w-48 sm:w-64 lg:w-80 pointer-events-none select-none"
        style={{ opacity: 0.15 }}
      />
      <div className="relative z-10 max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
        {/* Текст слева */}
        <div className="lg:max-w-2xl">
          <h2
            className="text-[32px] sm:text-[40px] lg:text-[48px] font-bold mb-6"
            style={{
              fontFamily: "var(--font-heading), sans-serif",
              color: "#F0F0F0",
            }}
          >
            Доступность и качество
          </h2>

          <p
            className="text-[16px] sm:text-[18px] lg:text-[20px] font-semibold leading-relaxed mb-4"
            style={{ color: "#F0F0F0" }}
          >
            Более 200 часов обучения с индивидуальными заданиями основ Python —
            совершенно бесплатно.
          </p>
          <p
            className="text-[14px] sm:text-[16px] lg:text-[18px] leading-relaxed"
            style={{ color: "rgba(240,240,240,0.75)" }}
          >
            Без подписок и пробного периода. Удобный курс для всех начинающих
            Python-разработчиков.
          </p>
        </div>

        {/* Кнопка справа */}
        <StartFreeBtn className="w-full lg:w-auto shrink-0" />
      </div>
    </section>
  );
}

// ─── Всё на одной странице ────────────────────────────────────────────────────

function PlatformSection() {
  return (
    <section
      className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-16"
      style={{ backgroundColor: "var(--color-bg-primary)" }}
    >
      <div className="max-w-7xl mx-auto">
        <h2
          className="text-[32px] sm:text-[40px] lg:text-[48px] font-bold text-center mb-10 sm:mb-12 lg:mb-16"
          style={{
            fontFamily: "var(--font-heading), sans-serif",
             color: "#F0F0F0" 
          }}
        >
          Всё на одной странице
        </h2>

        {/* Большое превью редактора */}
        <div className="mb-10 sm:mb-12 lg:mb-16">
          <Image
            src="/images/landing/editor.png"
            alt="Интерфейс редактора кода PyGen"
            width={1300}
            height={678}
            className="w-full rounded-2xl"
            style={{ boxShadow: "0 0 50px rgba(105,94,176,0.4)" }}
          />
        </div>

        {/* 4 карточки с пунктирной жёлтой границей */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {PLATFORM_FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="flex items-start gap-4 p-5 sm:p-6 rounded-xl"
              style={{
                border: "3px dashed var(--color-accent-yellow)",
                borderRadius: "12px",
              }}
            >
              {/* Акцентная точка */}
              <span
                className="mt-1.5 w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: "var(--color-accent-purple)" }}
              />
              <div>
                <p
                  className="text-[16px] sm:text-[18px] lg:text-[20px] font-bold mb-1.5"
                  style={{ color: "#F0F0F0"  }}
                >
                  {feature.title} 
                </p>
                <p
                  className="text-[13px] sm:text-[15px] lg:text-[16px] leading-relaxed"
                  style={{ color: "#F0F0F0"  }}
                >
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Отзывы ───────────────────────────────────────────────────────────────────

function ReviewsSection() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-16 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2
          className="text-[32px] sm:text-[40px] lg:text-[48px] font-bold text-center mb-10 sm:mb-12"
          style={{
            fontFamily: "var(--font-heading), sans-serif",
            color: "#0C0C0C",
          }}
        >
          Отзывы
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {REVIEWS.map((review, i) => (
            <article
              key={i}
              className="p-5 sm:p-6 rounded-xl bg-white"
              style={{
                border: "1px solid #1A1A2E",
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: "#695EB0" }}
                />
                <span
                  className="font-bold text-[16px] sm:text-[18px]"
                  style={{ color: "#0C0C0C" }}
                >
                  {review.name}
                </span>
              </div>
              <p
                className="text-[14px] sm:text-[15px] lg:text-[16px] leading-relaxed"
                style={{ color: "#0C0C0C" }}
              >
                {review.text}
              </p>
            </article>
          ))}
        </div>

        {/* Кнопка под отзывами */}
        <div className="flex justify-center mt-10 sm:mt-12 lg:mt-16">
          <StartFreeBtn />
        </div>
      </div>
    </section>
  );
}
