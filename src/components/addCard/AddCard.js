import React, { useState } from "react";
import "./addCard.scss";

function AddCard({ row, addCard }) {
  const [showAddForm, setShowAddForm] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setShowAddForm(false);
    addCard(row, event.target.text.value);
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
          autoFocus
        />
        <button className="add-card__submit" type="submit">Добавить карточку</button>
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
