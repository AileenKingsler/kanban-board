import React from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import AddCard from '../addCard/AddCard';
import Card from '../card/Card';
import './column.scss';

function Column({ id, title, cards }) {
  return (
    <div className={`column column--${id}`}>
      <div className="column__header">
        {title} ({cards.length})
      </div>
      <div className="column__body">
        <Droppable droppableId={`${id}`}>
          {(provided) => (
            <ul
              className="column__card-list"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {cards.map(({ id, row, text }, index) => {
                return (
                  <Draggable key={`${id}`} draggableId={`${id}`} index={index}>
                    {(provided) => (
                      <li
                        className="column__card"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <Card id={id} row={row} text={text} />
                      </li>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
        <AddCard columnId={`${id}`} />
      </div>
    </div>
  );
}

export default Column;
