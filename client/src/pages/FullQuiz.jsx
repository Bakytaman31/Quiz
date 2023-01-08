import React from 'react';
import { useParams } from 'react-router-dom';
import axios from '../axios';
import { Quiz } from '../components/Quiz';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Button, CardActions, CircularProgress } from '@mui/material';
import { toast } from 'react-toastify';
import 'easymde/dist/easymde.min.css';

export const FullQuiz = () => {
  const [quizPassed, setQuizPassed] = React.useState();
  const [data, setData] = React.useState({});
  const [isLoading, setLoading] = React.useState(true);
  const [quizAnswers, setQuizAnswers] = React.useState([]);
  const { id } = useParams();

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await axios.get(`/resultsByUser/${id}`)
      .then((res) => {
        setQuizPassed(res.data);
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

      await axios.get(`/quizes/${id}`)
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
          console.log(err);
          toast.error('Ошибка при получении квиза', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            pauseOnHover: true,
            theme: "colored",
            });
      })
    }
    fetchData();
  }, [id])


  if (isLoading) {
    return (  <div style={{display: 'flex', justifyContent: 'center', marginTop: '100px'}}>
                <CircularProgress size={200} />
              </div>
            )
  }

  const onChangeHandler = (e, i) => {
    const answers = [...quizAnswers];
    answers[i] = e.target.value;
    setQuizAnswers(answers);
  }
  
  const onSubmit = async () => {
    if (data.questions.length === quizAnswers.length) {
        let scores = 0;
        quizAnswers.map((quizAnswer) => {
          data.questions.map((correctAnswer) => {
            if (quizAnswer === correctAnswer.correctAnswer) {
              scores++
            }
          })
        })
        try{
          const fields = {
            result: scores
          };
          await axios.post(`/results/${id}`, fields)
          toast.success('Ваш результат: ' + scores, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            pauseOnHover: true,
            theme: "colored",
            });
        } catch(err){
          console.log(err);
          toast.error('Ошибка при сдаче квиза', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            pauseOnHover: true,
            theme: "colored",
            });
        }
        await axios.get(`/resultsByUser/${id}`)
        .then((res) => {
          setQuizPassed(res.data);
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
    } else {
      toast.error('Вы не ответили на все вопросы', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        pauseOnHover: true,
        theme: "colored",
        });
    }
  }

 
  const quiz = 
  <>
    <Quiz
      id={data._id}
      title={data.name}
      user={data.author}
      createdAt={data.createdAt}
      video={data.video}
      file={data.file}
      audio={data.audio}
      isFullPost>
        {data.questions.map((question, i) => {
          let counter = i + 1;
          return(
          <div key={i} style={{marginTop: "20px"}}>
            <h2>{counter + ") " +question.questionText}</h2>
            {question.answers.map((answer, j) => (
              <div key={j}>
                <input type="radio" value={answer} checked={answer === quizAnswers[i]} onChange={(e) => onChangeHandler(e, i)}/>{answer}
              </div>
            ))}
          </div>
          )
        })}
        <Button variant="contained" onClick={onSubmit} style={{marginTop: "20px"}}>Завершить</Button>
    </Quiz>
  </>;

  const resultPage = 
  <>
    <Card sx={{ maxWidth: "xl" }}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {data.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Ваш результат: {quizPassed.result}
          </Typography>
        </CardContent>
      <CardActions>
      </CardActions>
    </Card>
  </>;
   
   const page = quizPassed ? resultPage : quiz;
   

   return page
};
