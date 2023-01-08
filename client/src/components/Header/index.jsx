import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';

import styles from './Header.module.scss';
import Container from '@mui/material/Container';
import { logout, selectIsAuth, role } from '../../redux/slices/auth';

export const Header = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);
  const isTeacher = useSelector(role);

  const onClickLogout = () => {
    if (window.confirm('Вы действительно хотите выйти?')) {
      dispatch(logout());
      window.localStorage.removeItem('token');
    }
  };
  
  if(isAuth && isTeacher) {
    return (
      <div className={styles.root}>
        <Container maxWidth="lg">
          <div className={styles.inner}>
            <Link className={styles.logo} to="/">
              <div>QUIZ</div>
            </Link>
            <div className={styles.buttons}>
                  <Link to="/myQuizes">
                    <Button variant="outlined">Мои квизы</Button>
                  </Link>
                  <Link to="/add-quiz">
                    <Button variant="contained">Новый квиз</Button>
                  </Link>
                  <Button onClick={onClickLogout} variant="contained" color="error">
                    Выйти
                  </Button>
            </div>
          </div>
        </Container>
      </div>
    );
  } 
  else if (isAuth){
              return (
                <div className={styles.root}>
                  <Container maxWidth="lg">
                    <div className={styles.inner}>
                      <Link className={styles.logo} to="/">
                        <div>QUIZ</div>
                      </Link>
                      <div className={styles.buttons}>
                            <Button onClick={onClickLogout} variant="contained" color="error">
                              Выйти
                            </Button>
                      </div>
                    </div>
                  </Container>
                </div>
              );
            }
 else {
  return (
    <div className={styles.root}>
      <Container maxWidth="lg">
        <div className={styles.inner}>
          <Link className={styles.logo} to="/">
            <div>QUIZ</div>
          </Link>
          <div className={styles.buttons}>
                 <Link to="/login">
                   <Button variant="outlined">Войти</Button>
                 </Link>
                 <Link to="/register">
                   <Button variant="contained">Создать аккаунт</Button>
                 </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
};
