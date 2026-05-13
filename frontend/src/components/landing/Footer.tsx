import Image from "next/image";
import Link from "next/link";

const NAV_LINKS = [
  { label: "Главная",    href: "/" },
  { label: "Курсы",      href: "/topics" },
  { label: "Профиль",    href: "/profile" },
  { label: "Справочник", href: "/reference" },
];

const SOCIALS = [
  { name: "telegram",  url: "https://t.me/",             icon: "/images/landing/social-telegram.svg" },
  { name: "vk",        url: "https://vk.com/",           icon: "/images/landing/social-vk.svg" },
  { name: "youtube",   url: "https://youtube.com/",      icon: "/images/landing/social-youtube.svg" },
  { name: "max",       url: "https://max.com/",          icon: "/images/landing/social-max.svg" },
];

export function Footer() {
  return (
    <footer
      className="px-4 sm:px-6 lg:px-16 py-12 sm:py-14 lg:py-16"
      style={{ backgroundColor: "var(--color-bg-primary)" }}
    >
      <div className="max-w-7xl mx-auto">

        {/* Верхний ряд */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 mb-8">

          {/* Логотип */}
          <div className="col-span-2 lg:col-span-1">
            <Image
              src="/images/landing/logo.png"
              alt="PyGen"
              width={200}
              height={80}
              className="h-16 sm:h-20 w-auto object-contain"
            />
          </div>

          {/* О сайте */}
          <div>
            <h3
              className="font-bold mb-4 text-[16px] sm:text-[18px]"
              style={{
                fontFamily: "var(--font-heading), sans-serif",
                color: "#FFFFFF",
              }}
            >
              О сайте
            </h3>
            <ul className="flex flex-col gap-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm sm:text-base hover:opacity-80 transition-opacity"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Контакты */}
          <div>
            <h3
              className="font-bold mb-4 text-[16px] sm:text-[18px]"
              style={{
                fontFamily: "var(--font-heading), sans-serif",
                color: "#FFFFFF",
              }}
            >
              Контакты
            </h3>
            <ul className="flex flex-col gap-2 mb-6">
              <li className="text-sm sm:text-base" style={{ color: "var(--color-text-secondary)" }}>
                pygen@gmail.com
              </li>
              <li className="text-sm sm:text-base" style={{ color: "var(--color-text-secondary)" }}>
                +79243338813
              </li>
            </ul>

            {/* Соцсети */}
            <div className="flex items-center gap-3">
              {SOCIALS.map(({ name, url, icon }) => (
                <a
                  key={name}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-opacity hover:opacity-80"
                  style={{ backgroundColor: "var(--color-accent-purple)" }}
                  aria-label={name}
                >
                  <img src={icon} alt={name} width={18} height={18} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Копирайт */}
        <div
          className="pt-6 border-t"
          style={{ borderColor: "var(--color-border)" }}
        >
          <p
            className="text-xs sm:text-sm"
            style={{ color: "var(--color-text-muted)" }}
          >
            @2026 Pygen
          </p>
        </div>
      </div>
    </footer>
  );
}
