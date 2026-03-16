import { FC, useContext } from "react";
import classNames from "classnames/bind";
import * as yup from "yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { ThemeContext } from "@/context";
import { ILoginForm } from "@/models/ILoginForm";

import { Input } from "@/ui/Input";
import { AuthButtonsList } from "@/modules/AuthButtonsList";
import { useLoginMutation } from "@/store/api/AuthApi";
import { LocalStorageNames } from "@/constants/localeStorage";
import { cookies, CookiesNames } from "@/constants/cookies";
import { AppRoutes } from "@/constants/paths";

import styles from "./styles.module.scss";

const cx = classNames.bind(styles);

const schema = yup
  .object()
  .shape({
    username: yup.string().required(),
    password: yup.string().required(),
  })
  .required();

const LoginForm: FC = () => {
  const { theme } = useContext(ThemeContext);
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<ILoginForm>({
    resolver: yupResolver(schema) as any,
  });
  const [trigger, { isError }] = useLoginMutation();

  const onSubmit: SubmitHandler<ILoginForm> = async (data) => {
    const response = await trigger(data).unwrap();
    localStorage.setItem(LocalStorageNames.AUTH, response.access);
    cookies.set(CookiesNames.AUTH, response.refresh, {
      expires: new Date(Date.now() + 86400000),
    });
    window.location.href = AppRoutes.MAIN;
  };

  return (
    <form className={cx("login-form")} onSubmit={handleSubmit(onSubmit)}>
      <div className={cx("login-form__input")}>
        <Input
          {...register("username")}
          theme={theme}
          cancelled={isError}
          placeholder="Логин или e-mail"
          error={errors?.username?.message}
        />
        {errors?.username?.message && (
          <div className={cx("login-form__error")}>
            {errors?.username?.message}
          </div>
        )}
      </div>
      <div className={cx("login-form__input")}>
        <Input
          {...register("password")}
          theme={theme}
          cancelled={isError}
          placeholder="Пароль"
          type="password"
          error={errors?.password?.message}
        />
        {errors?.password?.message && (
          <div className={cx("login-form__error")}>
            {errors?.password?.message}
          </div>
        )}
      </div>
      {isError && (
        <div className={cx("login-form__error")}>Неверный логин или пароль</div>
      )}
      <AuthButtonsList text="Войти" />
    </form>
  );
};

export default LoginForm;
