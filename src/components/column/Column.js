import React from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import Card from "../card/Card";
import AddCard from "../addCard/AddCard";
import "./column.scss";

function Column({ id, title, items = [], addCard, deleteCard }) {
  const renderCards = () => {
    return items.map(({ id, row, text }, index) => (
      <Draggable key={`${id}`} draggableId={`${id}`} index={index}>
        {(provided) => (
          <li
            className="column__card"
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <Card id={id} row={row} text={text} deleteCard={deleteCard} />
          </li>
        )}
      </Draggable>
    ))
  };

  return (
    <div className={`column column--${id}`}>
      <div className="column__header">{title}({items.length})</div>
      <div className="column__body">
        <Droppable droppableId={`${id}`}>
          {(provided) => (
            <ul className="column__card-list" {...provided.droppableProps} ref={provided.innerRef}>
              {renderCards()}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
        <AddCard row={`${id}`} addCard={addCard} />
      </div>
    </div>
  );
}

export default Column;
