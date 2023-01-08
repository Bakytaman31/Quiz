import React from 'react';
import { useSelector } from 'react-redux';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import axios from '../axios.js';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Quiz } from '../components/Quiz';
import CircularProgress from '@mui/material/CircularProgress'
import { toast } from 'react-toastify';
import 'easymde/dist/easymde.min.css';

export const Home = () => {
  const userData = useSelector((state) => state.auth.data);
  const [actualQuizes, setActualQuizes] = React.useState([]);
  const [teachers, setTeachers] = React.useState([]);
  const [teacher, setTeacher] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await axios.get('/quizes')
      .then((res) => {
        setActualQuizes((res.data).reverse());
      })
      .catch((err) => {
        console.log(err);
        toast.error('Ошибка при получении квизов', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          pauseOnHover: true,
          theme: "colored",
          });
      })
      await axios.get('/getTeachers')
      .then((res) => {
        setTeachers(res.data);
      })
      .catch((err) => {
        console.log(err);
        toast.error('Ошибка при получении преподавателей', {
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

  const teacherHandler = async (e) => {
    let oldQuizes;
    let newQuizes = [];
    setTeacher(e.target.value)
    setLoading(true);
    await axios.get('/quizes')
      .then((res) => {
        oldQuizes = (res.data).reverse();
      })
      .catch((err) => {
        console.log(err);
        toast.error('Ошибка при получении квизов', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          pauseOnHover: true,
          theme: "colored",
          });
      })
    
    oldQuizes.map((obj) => {
      if (obj.author.fullName === e.target.value) {
        newQuizes.push(obj);
      } else if (e.target.value === '') {
        newQuizes = oldQuizes;
      }
    })
    setActualQuizes(newQuizes);
    setLoading(false);
  }

  const deleteQuiz = async id => {
    if (window.confirm('Вы действительно хотите удалить квиз?')) {
      try {
        setLoading(true);
        await axios.delete(`/quizes/${id}`);
        await axios.get('/quizes')
        .then((res) => {
          setActualQuizes((res.data).reverse());
        })
        toast.success('Квиз удален', {
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
        toast.error('Ошибка при удалении квиза', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          pauseOnHover: true,
          theme: "colored",
          });
      }
    }
  }

  if (loading) {
    return (  <div style={{display: 'flex', justifyContent: 'center', marginTop: '100px'}}>
                <CircularProgress size={200} />
              </div>
            )
  }

  return (
    <>
      <Grid container spacing={4}>
        <Grid xs={12} item>
          <Box sx={{ minWidth: 'xl' }} style={{marginBottom: '20px'}}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Преподаватель</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={teacher}
                label="Преподаватель"
                onChange={teacherHandler}
              >
                <MenuItem value=""><p></p></MenuItem>
                {teachers.map((teacher) => (
                  <MenuItem key={teacher._id} value={teacher.fullName}>{teacher.fullName}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
            {actualQuizes.map((obj) => (
                 <Quiz
                    key={obj._id}
                    id={obj._id}
                    title={obj.name}
                    user={obj.author}
                    createdAt={obj.createdAt}
                    deleteHandler={deleteQuiz}
                    date={obj.expDate}
                    isEditable={userData?._id === obj.author._id}
                  /> 
              )
          )} 
        </Grid>
      </Grid>
    </>
  );
};
