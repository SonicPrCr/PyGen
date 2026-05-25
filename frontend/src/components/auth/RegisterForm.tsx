"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthStore } from "@/lib/stores/authStore";

const schema = z.object({
  email:       z.string().email("Введите корректный email"),
  password:    z.string().min(8, "Пароль — минимум 8 символов"),
  first_name:  z.string().min(1, "Введите имя"),
  last_name:   z.string().min(1, "Введите фамилию"),
  middle_name: z.string().optional(),
  age:         z.number({ error: "Введите число" }).int().min(1).max(120).optional(),
});

type FormData = z.infer<typeof schema>;

const inputCls =
  "w-full border border-[#D4D4D4] rounded-lg px-3 py-2 text-sm text-[#1A1A1A] outline-none focus:border-[#695EB0] transition-colors";

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs text-[#6E6D6D] mb-1">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

export function RegisterForm() {
  const { register: registerUser, closeModal, openLogin } = useAuthStore();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      await registerUser({
        email:       data.email,
        password:    data.password,
        first_name:  data.first_name,
        last_name:   data.last_name,
        middle_name: data.middle_name,
        age:         data.age,
      });
      closeModal();
    } catch (err: unknown) {
      const errData = (err as { response?: { data?: Record<string, string[]> } })?.response?.data;
      const msg =
        errData?.email?.[0] ??
        errData?.non_field_errors?.[0] ??
        "Ошибка регистрации. Попробуйте ещё раз.";
      setError("root", { message: msg });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
      <h2 className="text-xl font-bold text-[#1A1A1A]">Регистрация</h2>

      <Field label="Электронная почта" error={errors.email?.message}>
        <input {...register("email")} type="email" autoComplete="email" className={inputCls} />
      </Field>

      <Field label="Придумайте пароль" error={errors.password?.message}>
        <input {...register("password")} type="password" autoComplete="new-password" className={inputCls} />
      </Field>

      {/* Имя + Фамилия */}
      <div className="grid grid-cols-2 gap-3">
        <Field label="Имя" error={errors.first_name?.message}>
          <input {...register("first_name")} type="text" autoComplete="given-name" className={inputCls} />
        </Field>
        <Field label="Фамилия" error={errors.last_name?.message}>
          <input {...register("last_name")} type="text" autoComplete="family-name" className={inputCls} />
        </Field>
      </div>

      {/* Отчество + Возраст */}
      <div className="grid grid-cols-2 gap-3">
        <Field label="Отчество" error={errors.middle_name?.message}>
          <input {...register("middle_name")} type="text" autoComplete="additional-name" className={inputCls} />
        </Field>
        <Field label="Возраст" error={errors.age?.message}>
          <input
              {...register("age", {
                setValueAs: (v) => (v === "" || v === undefined ? undefined : Number(v)),
              })}
              type="number" min={1} max={120} className={inputCls}
            />
        </Field>
      </div>

      {errors.root && (
        <p className="text-xs text-red-500 text-center">{errors.root.message}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 rounded-lg font-bold text-base text-black transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ backgroundColor: "var(--color-accent-yellow)", boxShadow: "0 4px 4px rgba(0,0,0,0.2)" }}
      >
        {isSubmitting ? "Регистрация…" : "Зарегистрироваться"}
      </button>

      <p className="text-xs text-center text-[#6E6D6D]">
        Если у вас уже есть аккаунт —{" "}
        <button type="button" onClick={openLogin} className="text-[#695EB0] font-semibold hover:underline">
          Войти
        </button>
      </p>
    </form>
  );
}
