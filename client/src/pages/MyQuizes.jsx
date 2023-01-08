import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Grid from '@mui/material/Grid';
import { Quiz } from '../components/Quiz';
import { fetchMyQuizes } from '../redux/slices/quizes';
import CircularProgress from '@mui/material/CircularProgress'

export const MyQuizes = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.data);
  const { quizes } = useSelector((state) => state.quizes);


  const isQuizesLoading = quizes.status === 'loading';

  React.useEffect(() => {
    dispatch(fetchMyQuizes());
  }, []);

  if (isQuizesLoading) {
    return (  <div style={{display: 'flex', justifyContent: 'center', marginTop: '100px'}}>
                <CircularProgress size={200} />
              </div>
            )
  }

  return (
    <>
      <Grid container spacing={4}>
        <Grid xs={12} item>
            {quizes.items.map((obj) => (
              <Quiz
                key={obj._id}
                id={obj._id}
                title={obj.name}
                user={obj.author}
                createdAt={obj.createdAt}
                isEditable={userData._id === obj.author._id}
              />
            ),
          )} 
        </Grid>
      </Grid>
    </>
  );
};
