import React, { useState, useEffect } from "react";
import axios from "axios";
import { DragDropContext } from "react-beautiful-dnd";
import Column from "../column/Column";
import "./board.scss"

function Board() {
  const columns = ["On hold", "In progress", "Needs review", "Approved"];
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);

  const setCardsToState = (data) => {
    const cards = new Map();

    data.forEach(card => {
      if (!cards.has(card.row)) {
        cards.set(card.row, [card]);
      } else {
        cards.get(card.row).push(card);
      }
    });

    setItems(cards);
  };

  const getCards = () => {
    axios.get("https://trello.backend.tests.nekidaem.ru/api/v1/cards/")
      .then(response => {
        setIsLoaded(true);
        setCardsToState(response.data);
      })
      .catch(error => {
        setIsLoaded(true);
        setError(error);
      });
  };

  useEffect(() => {
    getCards();
  }, []);

  const addCardToState = (row, text) => {
    const itemsCopy = new Map(items);
    const cardPayload = { row, text };

    if (!itemsCopy.has(row)) {
      itemsCopy.set(row, [cardPayload]);
    } else {
      itemsCopy.get(row).push(cardPayload);
    }

    setItems(itemsCopy);
  };

  const addCard = (row, text) => {
    addCardToState(row, text);

    axios.post("https://trello.backend.tests.nekidaem.ru/api/v1/cards/", { row, text })
      .then(response => { getCards() })
      .catch(error => console.log(error));
  };

  const deleteCardFromState = (id, row) => {
    const itemsCopy = new Map(items);

    const column = itemsCopy.get(row);
    const itemIndex = column.findIndex(card => card.id === id);
    column.splice(itemIndex, 1);

    setItems(itemsCopy);
  };

  const deleteCard = (id, row) => {
    deleteCardFromState(id, row);

    axios.delete(`https://trello.backend.tests.nekidaem.ru/api/v1/cards/${id}/`)
      .then(response => { getCards() })
      .catch(error => console.log(error));
  };

  const updateCardInState = (source, destination) => {
    const itemsCopy = new Map(items);

    const sourceColumn = itemsCopy.get(source.droppableId);
    const [reorderedItem] = sourceColumn.splice(source.index, 1);
    reorderedItem.row = destination.droppableId;

    if (!itemsCopy.get(destination.droppableId)) {
      itemsCopy.set(destination.droppableId, [])
    }
    const destinationColumn = itemsCopy.get(destination.droppableId);
    destinationColumn.splice(destination.index, 0, reorderedItem);

    setItems(itemsCopy);
  };

  const updateCard = ({ id, row, seq_num, text }) => {
    axios.patch(`https://trello.backend.tests.nekidaem.ru/api/v1/cards/${id}/`, { row, seq_num, text })
      .then(response => { getCards() })
      .catch(error => console.log(error));
  };

  const handleOnDragEnd = ({ source, destination, draggableId }) => {
    if (!destination) return;

    if (source.droppableId === destination.droppableId && destination.index === source.index) return;

    const sourceColumn = items.get(source.droppableId);
    const reorderedItem = sourceColumn.find(card => card.id === Number(draggableId));
    const destinationColumn = items.get(destination.droppableId);
    const destinationCard = destinationColumn[destination.index];

    updateCardInState(source, destination);
    updateCard({ ...reorderedItem, row: destination.droppableId, seq_num: destinationCard.seq_num });
  }

  const renderContent = () => {
    if (error) {
      return <p>Ошибка: {error.message}</p>;
    } else if (!isLoaded) {
      return <p>Загрузка...</p>;
    } else {
      return (
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
            )
          })}
        </DragDropContext>
      );
    }
  };

  return (
    <main className="board">
      {renderContent()}
    </main>
  );
}

export default Board;
