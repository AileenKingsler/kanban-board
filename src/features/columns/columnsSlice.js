import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getSeqNum } from '../../helpers/getSeqNum';
import { createCard, fetchCards, updateCardInState } from '../cards/cardsSlice';

const initialState = {
  0: {
    id: 0,
    title: 'On hold',
    cardIds: [],
  },
  1: {
    id: 1,
    title: 'In progress',
    cardIds: [],
  },
  2: {
    id: 2,
    title: 'Needs review',
    cardIds: [],
  },
  3: {
    id: 3,
    title: 'Approved',
    cardIds: [],
  },
};

export const columnsSlice = createSlice({
  name: 'columns',
  initialState,
  reducers: {
    deleteCardFromColumn: (state, action) => {
      const { cardId, columnId } = action.payload;

      state[columnId].cardIds = state[columnId].cardIds.filter(
        (id) => id !== cardId
      );
    },
    moveCardInState: (state, action) => {
      const { cardId, sourceColumnId, destinationColumnId, destinationIndex } =
        action.payload;

      state[sourceColumnId].cardIds = state[sourceColumnId].cardIds.filter(
        (id) => {
          return id !== Number(cardId);
        }
      );
      state[destinationColumnId].cardIds.splice(
        destinationIndex,
        0,
        Number(cardId)
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCards.fulfilled, (state, action) => {
        Object.keys(state).forEach(
          (columnId) => (state[columnId].cardIds = [])
        );
        action.payload.forEach((card) => state[card.row].cardIds.push(card.id));
      })
      .addCase(createCard.fulfilled, (state, action) => {
        const { id, row } = action.payload;

        state[row].cardIds.push(id);
      });
  },
});

export const { deleteCardFromColumn, moveCardInState } = columnsSlice.actions;

export const moveCard = createAsyncThunk(
  'cards/moveCard',
  async (
    { cardId, sourceColumnId, destinationColumnId, destinationIndex, text },
    { dispatch, getState, extra: { cardsAPI } }
  ) => {
    const order = getSeqNum(
      getState().cards.entities,
      getState().columns[destinationColumnId].cardIds,
      destinationIndex
    );
    dispatch(
      moveCardInState({
        cardId,
        sourceColumnId,
        destinationColumnId,
        destinationIndex,
      })
    );
    dispatch(updateCardInState({ cardId, destinationColumnId }));
    const response = await cardsAPI.updateCard(
      cardId,
      destinationColumnId,
      order,
      text
    );
    return response.data;
  }
);

export default columnsSlice.reducer;
