import { configureStore } from '@reduxjs/toolkit';
import { cardsAPI } from '../api/api';
import cardsReducer from '../features/cards/cardsSlice';
import columnsReducer from '../features/columns/columnsSlice';

export const store = configureStore({
  reducer: {
    columns: columnsReducer,
    cards: cardsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: { cardsAPI },
      },
    }),
});
