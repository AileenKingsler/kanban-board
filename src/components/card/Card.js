import React from "react";
import axios from "axios";
import "./card.scss"

function Card({ id, text, getCards }) {
  const deleteCard = id => {
    axios.delete(`https://trello.backend.tests.nekidaem.ru/api/v1/cards/${id}/`)
      .then(response => {
        getCards();
      })
      .catch(error => console.log(error));
  };

  return (
    <div className="card">
      <p className="card__id"><span className="card__id-title">id:</span> {id}</p>
      <p className="card__text">{text}</p>
      <button
        className="card__delete"
        type="button"
        aria-label={`Удалить карточку №${id}`}
        onClick={() => deleteCard(id)}
      />
    </div>
  );
}

export default Card;
