import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://trello.backend.tests.nekidaem.ru/api/v1/',
});

export const setAuthToken = (token) => {
  if (token) {
    instance.defaults.headers.common['Authorization'] = `JWT ${token}`;
  } else delete instance.defaults.headers.common['Authorization'];
};

const fetchCards = () => instance.get('cards/');

const createCard = (row, text) => instance.post('cards/', { row, text });

const deleteCard = (id) => instance.delete(`cards/${id}/`);

const updateCard = (id, row, seq_num, text) =>
  instance.patch(`cards/${id}/`, { row, seq_num, text });

const login = (username, password) =>
  instance
    .post('users/login/', { username, password })
    .then((response) => response.data);

const signup = (username, email, password) =>
  instance
    .post('users/create/', { username, email, password })
    .then((response) => response.data);

export const cardsAPI = {
  fetchCards,
  createCard,
  deleteCard,
  updateCard,
};

export const usersAPI = {
  login,
  signup,
};
