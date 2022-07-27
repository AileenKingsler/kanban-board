import React, { useEffect, useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { API } from '../../api/api';
import getSeqNum from '../../helpers/getSeqNum';
import Column from '../column/Column';
import './board.scss';

function Board() {
  const columns = ['On hold', 'In progress', 'Needs review', 'Approved'];
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);

  const setCardsToState = (data) => {
    const cards = new Map();

    data.forEach((card) => {
      if (!cards.has(card.row)) {
        cards.set(card.row, [card]);
      } else {
        cards.get(card.row).push(card);
      }
    });

    setItems(cards);
  };

  useEffect(() => {
    API.getCards()
      .then((data) => {
        setCardsToState(data);
        setIsLoaded(true);
      })
      .catch((error) => {
        setError(error);
        setIsLoaded(true);
      });
  }, []);

  const addCard = (row, text) => {
    const itemsCopy = new Map(items);
    const cardPayload = { row, text };

    if (!itemsCopy.has(row)) {
      itemsCopy.set(row, [cardPayload]);
    } else {
      itemsCopy.get(row).push(cardPayload);
    }

    setItems(itemsCopy);
    API.addCard(row, text).catch((error) => console.log(error));
  };

  const deleteCard = (id, row) => {
    const itemsCopy = new Map(items);

    const column = itemsCopy.get(row);
    const itemIndex = column.findIndex((card) => card.id === id);
    column.splice(itemIndex, 1);

    setItems(itemsCopy);
    API.deleteCard(id).catch((error) => console.log(error));
  };

  const updateCardInState = (source, destination) => {
    const itemsCopy = new Map(items);

    const sourceColumn = itemsCopy.get(source.droppableId);
    const [reorderedItem] = sourceColumn.splice(source.index, 1);
    reorderedItem.row = destination.droppableId;

    if (!itemsCopy.get(destination.droppableId)) {
      itemsCopy.set(destination.droppableId, []);
    }
    const destinationColumn = itemsCopy.get(destination.droppableId);
    destinationColumn.splice(destination.index, 0, reorderedItem);

    setItems(itemsCopy);
  };

  const handleOnDragEnd = ({ source, destination, draggableId }) => {
    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      destination.index === source.index
    )
      return;

    const sourceColumn = items.get(source.droppableId);
    const reorderedItem = sourceColumn.find(
      (card) => card.id === Number(draggableId)
    );
    const seq_num = getSeqNum(
      items,
      destination.droppableId,
      destination.index
    );

    updateCardInState(source, destination);
    API.updateCard(
      reorderedItem.id,
      destination.droppableId,
      seq_num,
      reorderedItem.text
    ).catch((error) => console.log(error));
  };

  if (error) {
    return (
      <main className="board">
        <p>Ошибка: {error.message}</p>
      </main>
    );
  }

  if (!isLoaded) {
    return (
      <main className="board">
        <p>Загрузка...</p>
      </main>
    );
  }

  return (
    <main className="board">
      <DragDropContext onDragEnd={handleOnDragEnd}>
        {columns.map((title, id) => {
          const columnItems = items.get(id.toString());

          return (
            <Column
              key={id}
              id={id}
              title={title}
              items={columnItems}
              addCard={addCard}
              deleteCard={deleteCard}
            />
          );
        })}
      </DragDropContext>
    </main>
  );
}

export default Board;
