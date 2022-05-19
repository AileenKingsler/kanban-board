import React from "react";
import "./header.scss"

function Header() {
  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <header className="header">
      <button className="header__logout" type="button" onClick={logout}>
        Выйти
      </button>
    </header>
  );
}

export default Header;
