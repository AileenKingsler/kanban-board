import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { deleteCardFromColumn } from '../columns/columnsSlice';

const initialState = {
  entities: {},
  status: 'idle',
  error: null,
};

export const cardsSlice = createSlice({
  name: 'cards',
  initialState,
  reducers: {
    deleteCardFromState: (state, action) => {
      delete state.entities[action.payload.cardId];
    },
    updateCardInState: (state, action) => {
      state.entities[action.payload.cardId].row =
        action.payload.destinationColumnId;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCards.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const newEntities = {};
        action.payload.forEach((card) => (newEntities[card.id] = card));
        state.entities = newEntities;
      })
      .addCase(fetchCards.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createCard.fulfilled, (state, action) => {
        state.entities[action.payload.id] = action.payload;
      });
  },
});

export const { deleteCardFromState, updateCardInState } = cardsSlice.actions;

export const fetchCards = createAsyncThunk(
  'cards/fetchCards',
  async (arg, { extra: { cardsAPI } }) => {
    const response = await cardsAPI.fetchCards();
    return response.data;
  }
);

export const createCard = createAsyncThunk(
  'cards/createCard',
  async ({ columnId, text }, { extra: { cardsAPI } }) => {
    const response = await cardsAPI.createCard(columnId, text);
    return response.data;
  }
);

export const deleteCard = createAsyncThunk(
  'cards/deleteCard',
  async ({ cardId, columnId }, { dispatch, extra: { cardsAPI } }) => {
    dispatch(deleteCardFromColumn({ cardId, columnId }));
    dispatch(deleteCardFromState({ cardId }));
    const response = await cardsAPI.deleteCard(cardId);
    return response.data;
  }
);

export default cardsSlice.reducer;
