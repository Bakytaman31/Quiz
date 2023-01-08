import { Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Container from '@mui/material/Container';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Header } from './components';
import { Home, FullQuiz, Registration, AddQuiz, Login, MyQuizes, Results, NotFoundPage } from './pages';
import React from 'react';
import { fetchAuthMe, selectIsAuth } from './redux/slices/auth';

function App() {
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);

  React.useEffect(() => {
    dispatch(fetchAuthMe());
  }, []);

  return (
    <>
      <Header />
      <Container maxWidth="lg">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quizes/:id" element={isAuth ? <FullQuiz /> : <Login />} />
          <Route path="/quizes/:id/edit" element={isAuth ? <AddQuiz /> : <Login />} />
          <Route path="/myQuizes" element={isAuth ? <MyQuizes /> : <Login />} />
          <Route path="/results/:id" element={<Results />} />
          <Route path="/add-quiz" element={isAuth ? <AddQuiz /> : <Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Container>
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        pauseOnHover
        theme="colored"
      />
    </>
  );
}

export default App;
