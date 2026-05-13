"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthStore } from "@/lib/stores/authStore";

const schema = z.object({
  email: z.string().email("Введите корректный email"),
  password: z.string().min(1, "Введите пароль"),
});

type FormData = z.infer<typeof schema>;

const inputCls =
  "w-full border border-[#D4D4D4] rounded-lg px-3 py-2 text-sm text-[#1A1A1A] outline-none focus:border-[#695EB0] transition-colors";

export function LoginForm() {
  const { login, closeModal, openRegister } = useAuthStore();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      await login(data.email, data.password);
      closeModal();
    } catch {
      setError("root", { message: "Неверный email или пароль" });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col">
      <h2 className="text-xl font-bold text-[#1A1A1A] mb-5">Войти</h2>

      <div className="mb-4">
        <label className="block text-xs text-[#6E6D6D] mb-1">Электронная почта</label>
        <input {...register("email")} type="email" autoComplete="email" className={inputCls} />
        {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
      </div>

      <div className="mb-1">
        <label className="block text-xs text-[#6E6D6D] mb-1">Пароль</label>
        <input {...register("password")} type="password" autoComplete="current-password" className={inputCls} />
        {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
      </div>

      <div className="flex justify-end mb-5">
        <button type="button" className="text-xs text-[#6E6D6D] hover:text-[#695EB0] transition-colors">
          Забыли пароль?
        </button>
      </div>

      {errors.root && (
        <p className="text-xs text-red-500 mb-3 text-center">{errors.root.message}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 rounded-lg font-bold text-base text-black transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
        style={{ backgroundColor: "var(--color-accent-yellow)", boxShadow: "0 4px 4px rgba(0,0,0,0.2)" }}
      >
        {isSubmitting ? "Вход…" : "Войти"}
      </button>

      <p className="text-xs text-center text-[#6E6D6D]">
        Если у вас нет аккаунта —{" "}
        <button type="button" onClick={openRegister} className="text-[#695EB0] font-semibold hover:underline">
          Регистрация
        </button>
      </p>
    </form>
  );
}
