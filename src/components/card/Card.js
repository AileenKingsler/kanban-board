import React from 'react';
import { useDispatch } from 'react-redux';
import { deleteCard } from '../../features/cards/cardsSlice';
import './card.scss';

function Card({ id, row, text }) {
  const dispatch = useDispatch();
  const deleteCardBtnHandler = (cardId, columnId) => {
    dispatch(deleteCard({ cardId, columnId }));
  };

  return (
    <div className="card">
      <p className="card__id">
        <span className="card__id-title">id:</span> {id}
      </p>
      <p className="card__text">{text}</p>
      <button
        className="card__delete"
        type="button"
        aria-label={`Удалить карточку №${id}`}
        onClick={() => deleteCardBtnHandler(id, row)}
      />
    </div>
  );
}

export default Card;
