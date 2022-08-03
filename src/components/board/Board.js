import React, { useEffect } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCards } from '../../features/cards/cardsSlice';
import { moveCard } from '../../features/columns/columnsSlice';
import Column from '../column/Column';
import './board.scss';

function Board() {
  const columns = useSelector((state) => state.columns);
  const cards = useSelector((state) => state.cards.entities);
  const cardsStatus = useSelector((state) => state.cards.status);
  const cardsError = useSelector((state) => state.cards.error);
  const dispatch = useDispatch();

  useEffect(() => {
    if (cardsStatus === 'idle') {
      dispatch(fetchCards());
    }
  }, [cardsStatus, dispatch]);

  const handleOnDragEnd = ({ source, destination, draggableId }) => {
    if (!destination) return;

    const { droppableId: sourceColumnId, index: sourceIndex } = source;
    const { droppableId: destinationColumnId, index: destinationIndex } =
      destination;

    if (
      sourceColumnId === destinationColumnId &&
      sourceIndex === destinationIndex
    )
      return;

    dispatch(
      moveCard({
        cardId: draggableId,
        sourceColumnId,
        destinationColumnId,
        destinationIndex,
        text: cards[draggableId].text,
      })
    ).then(() => {
      dispatch(fetchCards());
    });
  };

  let content;

  if (cardsStatus === 'failed') {
    content = <p>{cardsError}</p>;
  } else if (cardsStatus === 'succeeded') {
    content = (
      <DragDropContext onDragEnd={handleOnDragEnd}>
        {Object.keys(columns).map((id, index) => {
          const columnTitle = columns[id].title;
          const columnCards = columns[id].cardIds.map(
            (cardId) => cards[cardId]
          );

          return (
            <Column
              key={index}
              id={index}
              title={columnTitle}
              cards={columnCards}
            />
          );
        })}
      </DragDropContext>
    );
  }

  return <main className="board">{content}</main>;
}

export default Board;
