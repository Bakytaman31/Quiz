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
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import { useTranslation } from 'react-i18next';

export const FullQuiz = () => {
  const [quizPassed, setQuizPassed] = React.useState();
  const [data, setData] = React.useState({});
  const [status, setStatus] = React.useState(true);
  const [isLoading, setLoading] = React.useState(true);
  const [quizAnswers, setQuizAnswers] = React.useState([]);
  const [esse,setEsse] = React.useState("");
  const { id } = useParams();
  const {t} = useTranslation();

  React.useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        window.location.reload();
      }
    };

    const fetchData = async () => {
      setLoading(true);
      await axios.get(`/resultsByUser/${id}`)
      .then((res) => {
        setQuizPassed(res.data);
      })
      .catch((err) => {
        console.log(err);
        toast.error(t("gettingResultsError"), {
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
        setStatus(res.data.open);
        let answers = [];
        for (let i=0; i< res.data.questions.length;i++) {
          answers.push("");
        }
        setQuizAnswers(answers);
        setLoading(false);
      })
      .catch((err) => {
          console.log(err);
          toast.error(t("gettingQuizError"), {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            pauseOnHover: true,
            theme: "colored",
            });
      })
    }
    fetchData();

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Очистка событий при размонтировании компонента
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [id,t])


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
        let esse = "";
        
        quizAnswers.map((quizAnswer) => {
          data.questions.map((correctAnswer) => {
            console.log(correctAnswer.type);
            if (correctAnswer.type === "esse") {
              esse = correctAnswer.correctAnswer;
              console.log(esse);
            } else if(quizAnswer === correctAnswer.correctAnswer && correctAnswer.type !== "esse") {
              scores++
            }
          })
        })
        try{
          let fields = {
            result: scores,
            esse:esse,
          };
          console.log(fields);
          await axios.post(`/results/${id}`, fields)
          toast.success(t("yourResult") + ": " + ((scores/data.questions.length)*100) + '%', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            pauseOnHover: true,
            theme: "colored",
            });
        } catch(err){
          console.log(err);
          toast.error(t("completeQuizError"), {
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
          toast.error(t("gettingResultsError"), {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            pauseOnHover: true,
            theme: "colored",
            });
      })
    } else {
      toast.error(t("didNotAnswerQuestions"), {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        pauseOnHover: true,
        theme: "colored",
        });
    }
  }

 
  const quiz = 
  <div>
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
          switch(question.type) {
            case "standart":
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
            case "missedWord":
              return(
                <div key={i} style={{marginTop: "20px"}}>
                  <h2>{counter + ") " + question.questionText + " "} 
                  <p></p>
                  <FormControl sx={{width: 200}}>
                    <TextField id="outlined-basic" label="Answer" variant="outlined" value={quizAnswers[i]} onChange={e => onChangeHandler(e,i)}/>
                  </FormControl>
                  </h2>
                  
                  
                </div>
                )
                case "esse":
                  return(
                    <div key={i} style={{marginTop: "20px"}}>
                  <h2>{counter + ") " + question.questionText}</h2> 
                  <FormControl fullWidth sx={{m: 1}}>
                  <TextField
                    id="outlined-multiline-static"
                    multiline
                    rows={15}
                    value={esse}
                    inputMode='email'
                    onChange={e => setEsse(e.target.value)}
                  />
                  </FormControl>
                
                  
                  
                </div>
                  )
            default:
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
          }
        })}
        <Button variant="contained" onClick={onSubmit} style={{marginTop: "20px"}}>{t("complete")}</Button>
    </Quiz>
  </div>;

  const resultPage = 
  <>
    <Card sx={{ maxWidth: "xl" }}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {data.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t("yourResult")}: {(quizPassed.result/data.questions.length)*100}%
          </Typography>
        </CardContent>
      <CardActions>
      </CardActions>
    </Card>
  </>;

const lockedQuiz = 
<>
  <Card sx={{ maxWidth: "xl" }}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {t("quizUnavalable")}
        </Typography>
      </CardContent>
    <CardActions>
    </CardActions>
  </Card>
</>;
   
   let page;

   if (quizPassed) {
    page = resultPage;
   } else if(!quizPassed && !status) {
    page = lockedQuiz;
   } else {
    page = quiz;
   }
   

   return page
};
