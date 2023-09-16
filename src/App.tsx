import React from 'react';
import Main from './pages/main';
import Loader from './components/loader/loader';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <>
      <Main />
      <Loader />
      <ToastContainer/>
    </>
  );
}

export default App;
