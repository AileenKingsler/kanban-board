import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createCard } from '../../features/cards/cardsSlice';
import './addCard.scss';

function AddCard({ columnId }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = (event) => {
    const text = event.target.text.value;

    event.preventDefault();
    setShowAddForm(false);
    dispatch(createCard({ columnId, text }));
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
        <button className="add-card__submit" type="submit">
          Добавить карточку
        </button>
        <button
          className="add-card__cancel"
          type="button"
          aria-label="Отменить"
          onClick={() => setShowAddForm(false)}
        />
      </form>
    );
  }

  return (
    <button
      className="add-card__btn"
      type="button"
      onClick={() => setShowAddForm(true)}
    >
      + Добавить карточку
    </button>
  );
}

export default AddCard;
