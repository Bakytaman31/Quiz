import React from 'react';
import { useSelector } from 'react-redux';
import Grid from '@mui/material/Grid';
import axios from '../axios';
import { toast } from 'react-toastify';
import 'easymde/dist/easymde.min.css';
import { useParams } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';

export const Results = () => {
  const { id } = useParams();
  const userData = useSelector((state) => state.auth.data);
  const [QuizResutls, setResults] = React.useState([]);
  const [isLoading, setLoading] = React.useState(false);
  const {t, i18n} = useTranslation();

  React.useEffect(() => {
    const fetchData = async () => {
        setLoading(true);
        await axios.get(`/results/${id}`)
        .then((res) => {
            setResults(res.data);
        })
        .catch((err) => {
          console.log(err);
          toast.error('Ошибка при получении результатов', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            pauseOnHover: true,
            theme: "colored",
            });
      })
      setLoading(false);
      }
      fetchData();
  }, [id]);

  const deleteResult = async resultID => {
    setLoading(true)
    await axios.delete(`/results/${resultID}`);
    await axios.get(`/results/${id}`)
        .then((res) => {
            setResults(res.data);
        })
        .catch((err) => {
          console.log(err);
          toast.error('Ошибка при получении результатов', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            pauseOnHover: true,
            theme: "colored",
            });
      })
      setLoading(false);
  }

  if (isLoading) {
    return (  <div style={{display: 'flex', justifyContent: 'center', marginTop: '100px'}}>
                <CircularProgress size={200} />
              </div>
            )
  }

  return (
    <>
      <Grid container spacing={4}>
        <Grid xs={12} item>
            {QuizResutls.length > 0 ? QuizResutls.map((obj) => (
              <Card sx={{ maxWidth: "xl" }} style={{margin: "20px auto"}} key={obj._id}>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {obj.user.fullName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Результат: {obj.result}%
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color='error' variant="contained" onClick={(e) => deleteResult(obj._id)}>Удалить</Button>
              </CardActions>
            </Card>
            ),
          ) : <h1 style={{textAlign: "center"}}>{t('noResults')}</h1>} 
        </Grid>
      </Grid>
    </>
  );
};
