import React from 'react';
import { Navigate } from 'react-router-dom';
import Board from '../components/board/Board';
import Header from '../components/header/Header';

function Home() {
  if (localStorage.getItem('token')) {
    return (
      <>
        <Header />
        <Board />
      </>
    );
  }

  return <Navigate to="/login" />;
}

export default Home;
