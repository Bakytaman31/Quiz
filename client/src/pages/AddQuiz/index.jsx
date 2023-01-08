import React from 'react';
import { useNavigate, Navigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { toast } from 'react-toastify';
import 'easymde/dist/easymde.min.css';
import CircularProgress from '@mui/material/CircularProgress'
import { selectIsAuth } from '../../redux/slices/auth';
import axios from '../../axios';
import styles from './AddQuiz.module.scss';
import { Worker } from '@react-pdf-viewer/core';
import { Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import ReactAudioPlayer from 'react-audio-player';
import Stack from '@mui/material/Stack';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import moment from "moment";
import dayjs from 'dayjs';

export const AddQuiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isAuth = useSelector(selectIsAuth);
  const [isLoading, setLoading] = React.useState(false);
  const [questions, setQuestions] = React.useState([{
    questionText: "",
    answers: ["", "", ""],
    correctAnswer: ""
  }]);
  const [video, setVideo] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [file, setFile] = React.useState('');
  const inputFileRef = React.useRef(null);
  const audioFileRef = React.useRef(null);
  const [audio, setAudio] = React.useState('');
  const [date, setDate] = React.useState(dayjs("24-12-2022"));

  const isEditing = Boolean(id);
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const onSubmit = async () => {
    try {
      setLoading(true);

      const fields = {
        name: title,
        questions,
        video,
        file,
        audio,
        // date
      };

      const { data } = isEditing
        ? await axios.patch(`/quizes/${id}`, fields)
        : await axios.post('/quizes', fields);

      const _id = isEditing ? id : data._id;
      isEditing ? toast.success('Квиз обновлен', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        pauseOnHover: true,
        theme: "colored",
        }) : toast.success('Новый квиз добавлен', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          pauseOnHover: true,
          theme: "colored",
          })
      setLoading(false);
      navigate(`/quizes/${_id}`);
    } catch (err) {
      setLoading(false);
      console.warn(err);
      toast.error('Ошибка при создани квиза', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        pauseOnHover: true,
        theme: "colored",
        })
    }
  };


  const handleChangeFile = async (event) => {
    try {
      setLoading(true);
      const formData = new FormData();
      const file = event.target.files[0];
      formData.append('file', file);
      const { data } = await axios.post('/upload', formData);
      setFile(data.url);
      setLoading(false);
    } catch (err) {
      console.warn(err);
      setLoading(false);
      toast.error('Ошибка при загрузке файла', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        pauseOnHover: true,
        theme: "colored",
        })
    }
  };

  const handleChangeAudio = async (event) => {
    try {
      setLoading(true);
      const formData = new FormData();
      const file = event.target.files[0];
      formData.append('file', file);
      const { data } = await axios.post('/upload', formData);
      setAudio(data.url);
      setLoading(false);
    } catch (err) {
      console.warn(err);
      setLoading(false);
      toast.error('Ошибка при загрузке файла', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        pauseOnHover: true,
        theme: "colored",
        })
    }
  };

  const onClickRemoveAudio = () => {
    audio = '';
  };
  

  const onClickRemoveFile = () => {
    setFile('');
  };


  const DateHandleChange = (inputDate) => {
    console.log(moment(inputDate).format("DD/MM/YYYY"))
    setDate(moment(inputDate).format("DD/MM/YYYY"));
  };

  const questionTextChange = (i, value) => {
    let newQuestions = [...questions];
    let item = {...newQuestions[i]};
    item.questionText = value;
    newQuestions[i] = item;
    setQuestions(newQuestions);
  }

  const answerTextChange = (i, j, value) => {
    let newQuestions = [...questions];
    let item = {...newQuestions[i]};
    item.answers = newQuestions[i].answers;
    item.answers[j] = value;
    setQuestions(newQuestions);
  }

  const correctAnswerTextChange = (i, value) => {
    let newQuestions = [...questions];
    let item = {...newQuestions[i]};
    item.correctAnswer = value;
    newQuestions[i] = item;
    setQuestions(newQuestions);
  }

  const onAdd = () => {
    const newQuestion = {
      questionText: "",
      answers: ["", "", ""],
      correctAnswer: ""
    };
    setQuestions([...questions, newQuestion]);
    console.log(questions);
  }

  React.useEffect(() => {
    setLoading(true);
    if (id) {
      axios
        .get(`/quizes/${id}`)
        .then((res) => {
          setTitle(res.data.name);
          setLoading(false);
          setVideo(res.data.video);
          setQuestions(res.data.questions);
          setFile(res.data.file);
          setLoading(false);
          setAudio(res.data.audio);
        })
        .catch((err) => {
          console.warn(err);
          setLoading(false);
          toast.error('Ошибка при получении статьи', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            pauseOnHover: true,
            theme: "colored",
            })
        });
    }
    setLoading(false);
  }, []);

  if (!window.localStorage.getItem('token') && !isAuth) {
    return <Navigate to="/" />;
  }

  if (isLoading) {
    return (  <div style={{display: 'flex', justifyContent: 'center', marginTop: '100px'}}>
                <CircularProgress size={200} />
              </div>
            )
  }

  return (
    <Paper style={{ padding: 30 }}>
      <TextField
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Название квиза..."
        value={title} 
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
      />
      <TextField
        style={{marginTop: "20px", marginBottom: "20px"}}
        variant="outlined"
        placeholder="Ссылка на видео"
        value={video} 
        onChange={(e) => setVideo(e.target.value)}
        fullWidth
      />
      <Button
        variant="contained"
        component="label"
      >
        Загрузить PDF файл
        <input
          ref={inputFileRef}
          type="file"
          onChange={handleChangeFile}
          accept="application/pdf"
          hidden
        />
      </Button>

      {file && (
        <>
          <Button variant="contained" color="error" onClick={onClickRemoveFile} style={{marginLeft: "20px"}}>
            Удалить
          </Button>
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.1.81/build/pdf.worker.min.js">
          <div style={{ height: "820px", marginTop: "20px", marginBottom: "20px" }}>
              <Viewer fileUrl={`http://localhost:8000${file}`}  plugins={[defaultLayoutPluginInstance]}/>
            </div>
          </Worker>
        </>
      )}


      <Button
        variant="contained"
        component="label"
        style={{marginLeft: "20px"}}
      >
          Загрузить Аудио файл
        <input
            ref={audioFileRef}
            type="file"
            onChange={handleChangeAudio}
            accept=".mp3,audio/*"
            hidden
        />
      </Button>
      {audio && (
        <>
          <Button variant="contained" color="error" onClick={onClickRemoveAudio} style={{marginLeft: "20px"}}>
            Удалить
          </Button>
          <p>
          <ReactAudioPlayer src={`http://localhost:8000${audio}`} controls style={{marginTop: "10px", width: "100%"}}/>
          </p>
        </>
      )}

      {/* <LocalizationProvider dateAdapter={AdapterDayjs} >
      <Stack spacing={3} style={{marginTop: "20px"}}>
        <DesktopDatePicker
          label="Выберите дату"
          inputFormat="DD/MM/YYYY"
          value={date}
          // minDate={new Date()}
          onChange={DateHandleChange}
          renderInput={(params) => <TextField {...params} />}
        />
      </Stack>
      </LocalizationProvider> */}
      
      {
        questions.map((question, i) => (
          <div key={i} style={{marginTop: "20px"}}>
            <TextField
              variant="outlined"
              placeholder='Вопрос'
              value={question.questionText} 
              onChange={(e) => questionTextChange(i, e.target.value)}
              fullWidth
            />
            {
              question.answers.map((answer, j) => (
                <div key={j}>
                    <TextField
                      variant="outlined"
                      placeholder='Ответ'
                      value={answer} 
                      onChange={(e) => answerTextChange(i, j, e.target.value)}
                      fullWidth
            />
                </div>
              ))
            }
            <TextField
              variant="outlined"
              placeholder='Правильный ответ'
              value={question.correctAnswer} 
              onChange={(e) => correctAnswerTextChange(i, e.target.value)}
              fullWidth
            />
          </div>
        ))
      }
      <div className={styles.buttons}>
      <Button onClick={onAdd} size="large" variant="contained">
          Добавить вопрос
        </Button>
        <Button onClick={onSubmit} size="large" variant="contained">
          Опубликовать
        </Button>
        <a href="/" style={{textDecoration: "none"}}>
          <Button size="large" variant="contained" color='error'>Отмена</Button>
        </a>
      </div>
    </Paper>
  );
};
