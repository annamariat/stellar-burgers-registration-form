import {
  Button,
  EmailInput,
  Input,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { clsx } from 'clsx';
import { useState } from 'react';

import { namePattern } from '../../utils/constants';

import type { IFormProps } from './types';
import type { ChangeEvent, FC, FormEvent } from 'react';

import styles from './form.module.css';

const MIN_PASSWORD_LENGTH = 6;

const NAME_ERROR = 'Некорректный формат имени';
const PASSWORD_ERROR = 'Некорректный пароль';
const MISMATCH_ERROR = 'Пароли не совпадают';

type TFormValues = {
  name: string;
  email: string;
  password: string;
  repeatPassword: string;
};

const initialValues: TFormValues = {
  name: '',
  email: '',
  password: '',
  repeatPassword: '',
};

// Используйте для проверки формата введённого имени
const isNameValid = (value: string): boolean => namePattern.test(value);
const isPasswordValid = (value: string): boolean => value.length >= MIN_PASSWORD_LENGTH;

export const Form: FC<IFormProps> = ({ setMode, className }) => {
  const [values, setValues] = useState<TFormValues>(initialValues);

  // Ошибки имени и повторного пароля храним сами: у Input нет встроенной проверки
  const [nameError, setNameError] = useState('');
  const [repeatError, setRepeatError] = useState('');

  // Email и пароль проверяют сами компоненты библиотеки, мы лишь узнаём результат
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPasswordFieldValid, setIsPasswordFieldValid] = useState(true);

  const [isRepeatVisible, setIsRepeatVisible] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleNameBlur = (): void => {
    setNameError(values.name && !isNameValid(values.name) ? NAME_ERROR : '');
  };

  const handleRepeatBlur = (): void => {
    setRepeatError(
      values.repeatPassword && !isPasswordValid(values.repeatPassword)
        ? PASSWORD_ERROR
        : ''
    );
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    const nameOk = isNameValid(values.name);
    const passwordOk = isPasswordValid(values.password);
    const repeatOk = isPasswordValid(values.repeatPassword);

    setNameError(nameOk ? '' : NAME_ERROR);

    if (!repeatOk) {
      setRepeatError(PASSWORD_ERROR);
      return;
    }

    if (values.password !== values.repeatPassword) {
      setRepeatError(MISMATCH_ERROR);
      return;
    }

    setRepeatError('');

    if (nameOk && passwordOk && isEmailValid) {
      setMode('complete');
    }
  };

  const isFilled = Object.values(values).every((value) => value.trim() !== '');

  return (
    <form
      className={clsx(styles.form, className)}
      data-testid="form"
      onSubmit={handleSubmit}
    >
      <div className={styles.icon} />
      <div className={styles.text_box}>
        <p className="text text_type_main-large">Мы нуждаемся в вашей силе!</p>
        <p className={clsx(styles.text, 'text text_type_main-medium')}>
          Зарегистрируйтесь на нашей платформе, чтобы присоединиться к списку
          контрибьюторов
        </p>
      </div>
      <fieldset className={styles.fieldset}>
        <Input
          type="text"
          placeholder="Имя"
          name="name"
          value={values.name}
          onChange={handleChange}
          onBlur={handleNameBlur}
          onFocus={() => setNameError('')}
          error={Boolean(nameError)}
          errorText={nameError}
          extraClass={clsx(styles.input, nameError && styles.input_error)}
          data-testid="name-input"
          required
        />
        <EmailInput
          name="email"
          value={values.email}
          onChange={handleChange}
          checkValid={setIsEmailValid}
          extraClass={clsx(styles.input, !isEmailValid && styles.input_error)}
          data-testid="email-input"
          required
        />
        <PasswordInput
          name="password"
          value={values.password}
          onChange={handleChange}
          checkValid={setIsPasswordFieldValid}
          extraClass={clsx(styles.input, !isPasswordFieldValid && styles.input_error)}
          data-testid="password-input"
          required
        />
        {/* Обычный Input вместо PasswordInput: ему можно передать свою ошибку «Пароли не совпадают» */}
        <Input
          type={isRepeatVisible ? 'text' : 'password'}
          placeholder="Повторите пароль"
          name="repeatPassword"
          value={values.repeatPassword}
          onChange={handleChange}
          onBlur={handleRepeatBlur}
          onFocus={() => setRepeatError('')}
          icon={isRepeatVisible ? 'HideIcon' : 'ShowIcon'}
          onIconClick={() => setIsRepeatVisible((prev) => !prev)}
          error={Boolean(repeatError)}
          errorText={repeatError}
          extraClass={clsx(styles.input, repeatError && styles.input_error)}
          data-testid="repeat-password-input"
          required
        />
        <Button htmlType="submit" type="primary" size="medium" disabled={!isFilled}>
          Зарегистрироваться
        </Button>
      </fieldset>
      <div className={styles.signin_box}>
        <p className="text text_type_main-default text_color_inactive">
          Уже зарегистрированы?
        </p>
        <Button
          htmlType="button"
          type="secondary"
          size="medium"
          extraClass={styles.signin_btn}
        >
          Войти
        </Button>
      </div>
    </form>
  );
};
