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

  const getCards = () => {
    axios.get("https://trello.backend.tests.nekidaem.ru/api/v1/cards/")
      .then(response => {
        setIsLoaded(true);

        const boardMap = new Map();
        response.data.map(card => {
          if (!boardMap.has(card.row)) {
            boardMap.set(card.row, [card]);
          } else {
            boardMap.get(card.row).push(card);
          }
          return [card.row, card];
        });

        setItems(boardMap);
      })
      .catch(error => {
        setIsLoaded(true);
        setError(error);
      });
  };

  useEffect(() => {
    getCards();
  }, []);

  const updateCard = (card, row, seq_num) => {
    const cardPayload = {
      row,
      seq_num,
      text: card.text,
    };

    axios.patch(`https://trello.backend.tests.nekidaem.ru/api/v1/cards/${card.id}/`, cardPayload)
      .then(response => {
        getCards();
      })
      .catch(error => {
        console.log(error);
      });
  };

  const handleOnDragEnd = ({ destination, source }) => {
    if (!destination) return;

    if (source.droppableId === destination.droppableId && destination.index === source.index) return;

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
    updateCard(reorderedItem, destination.droppableId, destination.index);
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
                getCards={() => getCards()}
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
