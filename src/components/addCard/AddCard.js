import React, { useState } from "react";
import axios from "axios";
import "./addCard.scss";

function AddCard({ id, getCards }) {
  const [showAddForm, setShowAddForm] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    const cardPayload = {
      row: id,
      text: event.target.text.value
    }

    axios.post("https://trello.backend.tests.nekidaem.ru/api/v1/cards/", cardPayload)
      .then(response => {
        setShowAddForm(false);
        getCards();
      })
      .catch(error => console.log(error));
  };

  if (showAddForm) {
    return (
      <form className="add-card" onSubmit={handleSubmit}>
        <textarea
          className="add-card__text"
          name="text"
          rows={4}
          placeholder="Ввести заголовок для этой карточки"
          required
        />
        <button className="add-card__submit" type="submin">Добавить карточку</button>
        <button
          className="add-card__cancel"
          type="button"
          aria-label="Отменить"
          onClick={() => setShowAddForm(false)}
        />
      </form>
    )
  }

  return (
    <button className="add-card__btn" type="button" onClick={() => setShowAddForm(true)}>
      + Добавить карточку
    </button>
  )
}

export default AddCard;
