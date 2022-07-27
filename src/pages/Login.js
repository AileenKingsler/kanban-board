import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { API, setAuthToken } from '../api/api';

function Login() {
  const [error, setError] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    const [username, password] = event.target;

    API.login(username.value, password.value)
      .then((data) => {
        const token = data.token;

        localStorage.setItem('token', token);

        setAuthToken(token);

        window.location.href = process.env.PUBLIC_URL;
      })
      .catch((error) => {
        setError(error);
        console.log(error);
      });
  };

  const renderErrors = (error) => {
    if (error) {
      const errors = [];

      for (let field in error.response.data) {
        errors.push(error.response.data[field]);
      }

      return <p className="form__note form__note--error">{errors}</p>;
    }
  };

  if (localStorage.getItem('token')) {
    return <Navigate to="/" />;
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="form__group">
        <label className="form__label" htmlFor="username">
          Логин
        </label>
        <input
          className="form__field"
          type="text"
          id="username"
          name="username"
          placeholder="user"
          required
        />
      </div>
      <div className="form__group">
        <label className="form__label" htmlFor="password">
          Пароль
        </label>
        <input
          className="form__field"
          type="password"
          id="password"
          name="password"
          placeholder="********"
          required
        />
      </div>
      <button className="form__submit" type="submit">
        Войти
      </button>
      <p className="form__note">
        Ещё нет аккаунта?{' '}
        <Link className="form__link" to="/signup">
          Зарегистрироваться
        </Link>
      </p>
      {renderErrors(error)}
    </form>
  );
}

export default Login;
