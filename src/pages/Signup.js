import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import setAuthToken from "../helpers/setAuthToken";

function Signup() {
  const [error, setError] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    const [username, email, password] = event.target;

    const signupPayload = {
      username: username.value,
      email: email.value,
      password: password.value
    }

    axios.post("https://trello.backend.tests.nekidaem.ru/api/v1/users/create/", signupPayload)
      .then(response => {
        const token = response.data.token;

        localStorage.setItem("token", token);

        setAuthToken(token);

        window.location.href = "/";
      })
      .catch(error => {
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

      return (
        <p className="form__note form__note--error">
          {errors}
        </p>
      )
    }
  };

  if (localStorage.getItem("token")) {
    return <Navigate to="/" />;
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="form__group">
        <label className="form__label" htmlFor="username">Логин</label>
        <input className="form__field" type="text" id="username" name="username" placeholder="user" required />
      </div>
      <div className="form__group">
        <label className="form__label" htmlFor="email">Email</label>
        <input className="form__field" type="email" id="email" name="email" placeholder="mail@mail.ru" />
      </div>
      <div className="form__group">
        <label className="form__label" htmlFor="password">Пароль</label>
        <input className="form__field" type="password" id="password" name="password" placeholder="********" required />
      </div>
      <button className="form__submit" type="submit">Зарегистрироваться</button>
      <p className="form__note">
        Уже есть аккаунт?
        {' '}
        <Link className="form__link" to="/login">Войти</Link>
      </p>
      {renderErrors(error)}
    </form>
  );
}

export default Signup;
