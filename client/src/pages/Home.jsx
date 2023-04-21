import React from 'react';
import { useSelector } from 'react-redux';
import Grid from '@mui/material/Grid';
import axios from '../axios.js';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Quiz } from '../components/Quiz';
import CircularProgress from '@mui/material/CircularProgress'
import { toast } from 'react-toastify';
import 'easymde/dist/easymde.min.css';
import { useTranslation } from 'react-i18next';

export const Home = () => {
  const userData = useSelector((state) => state.auth.data);
  const [actualQuizes, setActualQuizes] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [langType, setLangType] = React.useState('');
  const [langLevel, setLangLevel] = React.useState('');
  const {t, i18n} = useTranslation();

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await axios.get('/quizes')
      .then((res) => {
        setActualQuizes((res.data).reverse());
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
      setLoading(false);
    }
    fetchData();
  }, []);

  const langTypeHandler = e => {
    setLangType(e.target.value);
  }

  const langLevelHandler = e => {
    setLangLevel(e.target.value);
  }

  const deleteQuiz = async id => {
    if (window.confirm(t("deleteQuizConfirmation"))) {
      try {
        setLoading(true);
        await axios.delete(`/quizes/${id}`);
        await axios.get('/quizes')
        .then((res) => {
          setActualQuizes((res.data).reverse());
        })
        toast.success(t("quizDeleted"), {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          pauseOnHover: true,
          theme: "colored",
          });
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
        toast.error(t("quizDeleteError"), {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          pauseOnHover: true,
          theme: "colored",
          });
      }
    }
  }

  const lockQuiz = async id => {
    try {
      setLoading(true);
      await axios.post(`/quizes/lock/${id}`);
      await axios.get('/quizes')
      .then((res) => {
        setActualQuizes((res.data).reverse());
      })
      toast.success(t("quizClosed"), {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        pauseOnHover: true,
        theme: "colored",
        });
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
      toast.error(t("quizCloseError"), {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        pauseOnHover: true,
        theme: "colored",
        });
    }
  }; 

  const unlockQuiz = async id => {
    try {
      setLoading(true);
      await axios.post(`/quizes/unlock/${id}`);
      await axios.get('/quizes')
      .then((res) => {
        setActualQuizes((res.data).reverse());
      })
      toast.success(t("quizOpen"), {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        pauseOnHover: true,
        theme: "colored",
        });
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
      toast.error(t("quizOpenError"), {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        pauseOnHover: true,
        theme: "colored",
        });
    }
  }; 

  const typeAndLevelHandler = async e => {
    setLoading(true);
    let type;
    let level;
    let oldQuizes;
    let newQuizes = [];
    console.log(e.target.name)
    if (e.target.name === "type") {
      type = e.target.value;
      setLangType(type);
      level = langLevel;
    } else {
      level = e.target.value;
      setLangLevel(level);
      type = langType;
    }
    console.log(type, level)
    try {
      await axios.get(`/quizes/typeAndLevel?langType=${type}&langLevel=${level}`)
      .then((res) => {
        setActualQuizes(res.data)
      });
      
    } catch(e) {
      console.log(e);
    }
    setLoading(false);
  }


  if (loading) {
    return (  <div style={{display: 'flex', justifyContent: 'center', marginTop: '100px'}}>
                <CircularProgress size={200} />
              </div>
            )
  }

  return (
    <>
      <Grid container spacing={2}>
        <Grid xs={12} item>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <p></p>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">{t("langType")}</InputLabel>
              <Select
                name="type"
                value={langType}
                onChange={typeAndLevelHandler}
              >
                <MenuItem value="literaryGerman">{t('literaryGerman')}</MenuItem>
                <MenuItem value="technicalGerman">{t('technicalGerman')}</MenuItem>
              </Select>
            </FormControl>
            </Grid>
            <Grid item xs={6}>
              <p></p>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">{t("langLevel")}</InputLabel>
              <Select
                name="level"
                value={langLevel}
                onChange={typeAndLevelHandler}
              >
                <MenuItem value="A1">A1</MenuItem>
                <MenuItem value="A2">A2</MenuItem>
                <MenuItem value="B1">B1</MenuItem>
                <MenuItem value="B2">B2</MenuItem>
                <MenuItem value="C1">C1</MenuItem>
                <MenuItem value="C2">C2</MenuItem>
              </Select>
            </FormControl>
            </Grid>
        </Grid>
        <p></p>
            {actualQuizes.map((obj) => (
                 <Quiz
                    key={obj._id}
                    id={obj._id}
                    title={obj.name}
                    user={obj.author}
                    createdAt={obj.createdAt}
                    deleteHandler={deleteQuiz}
                    date={obj.expDate}
                    status={obj.open}
                    isEditable={userData?._id === obj.author._id}
                    lock={lockQuiz}
                    unlock={unlockQuiz}
                  /> 
              )
          )} 
        </Grid>
      </Grid>
    </>
  );
};
