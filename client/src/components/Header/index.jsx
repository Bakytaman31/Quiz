import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import { useTranslation } from 'react-i18next';

import styles from './Header.module.scss';
import Container from '@mui/material/Container';
import { logout, selectIsAuth, role } from '../../redux/slices/auth';

export const Header = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);
  const isTeacher = useSelector(role);
  const {t} = useTranslation();


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
                    <Button variant="outlined">{t("myQuizes")}</Button>
                  </Link>
                  <Link to="/add-quiz">
                    <Button variant="contained">{t("newQuiz")}</Button>
                  </Link>
                  <Button onClick={onClickLogout} variant="contained" color="error">
                    {t("logOut")}
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
                   <Button variant="outlined">{t('signInButton')}</Button>
                 </Link>
                 <Link to="/register">
                   <Button variant="contained">{t('signUpButton')}</Button>
                 </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
};
