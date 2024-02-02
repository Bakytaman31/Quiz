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
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useTranslation } from 'react-i18next';
import { Questions } from '../../components';

export const AddQuiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isAuth = useSelector(selectIsAuth);
  const [isLoading, setLoading] = React.useState(false);
  const [questions, setQuestions] = React.useState([{
    questionText: "",
    answers: ["", "", ""],
    type: "",
    correctAnswer: ""
  }]);
  const [video, setVideo] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [file, setFile] = React.useState('');
  const inputFileRef = React.useRef(null);
  const audioFileRef = React.useRef(null);
  const [audio, setAudio] = React.useState([]);
  const [langLevel, setLangLevel] = React.useState('');
  const {t} = useTranslation();

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
        langLevel
      };

      const { data } = isEditing
        ? await axios.patch(`/quizes/${id}`, fields)
        : await axios.post('/quizes', fields);

      const _id = isEditing ? id : data._id;
      isEditing ? toast.success('Quiz updated', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        pauseOnHover: true,
        theme: "colored",
        }) : toast.success('New quiz added', {
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
      toast.error('Error', {
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
      toast.error('Error while uploading file', {
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
      setAudio([...audio, data.url]);
      setLoading(false);
    } catch (err) {
      console.warn(err);
      setLoading(false);
      toast.error('Error while uploading file', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        pauseOnHover: true,
        theme: "colored",
        })
    }
  };

  const onClickRemoveAudio = i => {
    const files = [...audio];
    files.splice(i,1);
    setAudio(files);
  };
  

  const onClickRemoveFile = () => {
    setFile('');
  };

  const langLevelHandler = e => {
    setLangLevel(e.target.value);
  }

  const questionTypeChange = (i, value) => {
    let newQuestions = [...questions];
    let item = {...newQuestions[i]};
    item.type = value;
    item.questionText = "";
    newQuestions[i] = item;
    setQuestions(newQuestions);
  }

  const questionTextChange = (i, value) => {
    let newQuestions = [...questions];
    let item = {...newQuestions[i]};
    item.questionText = value;
    newQuestions[i] = item;
    setQuestions(newQuestions);
  }

  const missedWordQuestionTextChange = (i, j, value) => {
    let newQuestions = [...questions];
    let item = {...newQuestions[i]};
    item.questionText[j] = value;
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
      type: "",
      correctAnswer: ""
    };
    setQuestions([...questions, newQuestion]);
  }

  const addAnswer = i => {
    let newQuestions = [...questions];
    let item = {...newQuestions[i]};
    item.answers.push("");
    newQuestions[i] = item;
    setQuestions(newQuestions);
  }

  const deleteAnswer = i => {
    let newQuestions = [...questions];
    let item = {...newQuestions[i]};
    item.answers.splice(-1);
    newQuestions[i] = item;
    setQuestions(newQuestions);
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
          toast.error('Error while getting quiz', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            pauseOnHover: true,
            theme: "colored",
            })
        });
    }
    setLoading(false);
  }, [id]);

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
        placeholder={t('quizName')}
        value={title} 
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
      />
      <TextField
        style={{marginTop: "20px", marginBottom: "20px"}}
        variant="outlined"
        placeholder={t('videoLink')}
        value={video} 
        onChange={(e) => setVideo(e.target.value)}
        fullWidth
        autoComplete='off'
        autoCorrect='off'
        autoCapitalize='none'
      />
      <Button
        variant="contained"
        component="label"
      >
        {t('uploadPDF')}
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
          {t('deletePDF')}
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
          {t('uploadAudio')}
        <input
            ref={audioFileRef}
            type="file"
            onChange={handleChangeAudio}
            accept=".mp3,audio/*"
            hidden
        />
      </Button>
      {audio.length > 0 && (
        <>
          
          
          {audio.map((track, i) => (
            <div key={i}>
              <ReactAudioPlayer src={`http://localhost:8000${track}`} controls style={{marginTop: "10px", width: "100%"}}/>
              <Button variant="contained" color="error" onClick={e => onClickRemoveAudio(i)} style={{marginLeft: "20px"}}>
                {t('deleteAudio')}
              </Button>
          </div>
          ))}
          
        </>
      )}

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <p></p>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">{t("langLevel")}</InputLabel>
          <Select
            value={langLevel}
            onChange={langLevelHandler}
          >
            <MenuItem value="Beginner">Beginner</MenuItem>
            <MenuItem value="Elementary">Elementary</MenuItem>
            <MenuItem value="Pre-Intermediate">Pre-Intermediate</MenuItem>
            <MenuItem value="Intermediate">Intermediate</MenuItem>
            <MenuItem value="Upper-Intermediate">Upper-Intermediate</MenuItem>
            <MenuItem value="Advanced">Advanced</MenuItem>
          </Select>
        </FormControl>
        </Grid>
      </Grid>
      
      {
        questions.map((question, i) => (
          <div key={i}>
            <FormControl fullWidth sx={{mt: 4}}>
              <InputLabel id="demo-simple-select-label">{t('questionType')}</InputLabel>
              <Select
                value={question.type}
                onChange={e => questionTypeChange(i, e.target.value)}
              >
                <MenuItem value="standart">{t('standartQuestion')}</MenuItem>
                <MenuItem value="missedWord">{t('missedWord')}</MenuItem>
                <MenuItem value="highlightWord">Highlight word</MenuItem>
                <MenuItem value="esse">{t('esse')}</MenuItem>
              </Select>
            </FormControl>
            <Questions
              type={question.type}
              question={question.questionText}
              answers={question.answers}
              rightAnswer={question.correctAnswer}
              number={i}
              questionHandler={questionTextChange}
              answerHandler={answerTextChange}
              rightAnswerHandler={correctAnswerTextChange}
              addAnswer={addAnswer}
              deleteAnswer={deleteAnswer}
              missedWordQuestionHandler={missedWordQuestionTextChange}
            />
          </div>
        ))
      }
      <div className={styles.buttons}>
      <Button onClick={onAdd} size="large" variant="contained">
          {t('addQuestion')}
        </Button>
        <Button onClick={onSubmit} size="large" variant="contained">
          {t('publish')}
        </Button>
        <a href="/" style={{textDecoration: "none"}}>
          <Button size="large" variant="contained" color='error'>{t('cancel')}</Button>
        </a>
      </div>
    </Paper>
  );
};