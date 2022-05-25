import React from "react";
import "./card.scss"

function Card({ id, row, text, deleteCard }) {
  return (
    <div className="card">
      <p className="card__id"><span className="card__id-title">id:</span> {id}</p>
      <p className="card__text">{text}</p>
      <button
        className="card__delete"
        type="button"
        aria-label={`Удалить карточку №${id}`}
        onClick={() => deleteCard(id, row)}
      />
    </div>
  );
}

export default Card;
