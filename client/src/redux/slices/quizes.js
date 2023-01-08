import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axios';

export const fetchQuizes = createAsyncThunk('quizes/fetchQuizes', async () => {
  const { data } = await axios.get('/quizes');
  return data.reverse();
});

export const fetchMyQuizes = createAsyncThunk('quizes/fetchQuizes', async () => {
  const { data } = await axios.get(`/quizes/myquizes/`);
  return data.reverse();
});


export const fetchRemoveQuiz = createAsyncThunk('quizes/fetchRemoveQuiz', async (id) =>
  await axios.delete(`/quizes/${id}`),
);

const initialState = {
  quizes: {
    items: [],
    status: 'loading',
  },
};

const quizesSlice = createSlice({
  name: 'quizes',
  initialState,
  reducers: {},
  extraReducers: {
    // Получение статей
    [fetchQuizes.pending]: (state) => {
      state.quizes.items = [];
      state.quizes.status = 'loading';
    },
    [fetchQuizes.fulfilled]: (state, action) => {
      state.quizes.items = action.payload;
      state.quizes.status = 'loaded';
    },
    [fetchQuizes.rejected]: (state) => {
      state.quizes.items = [];
      state.quizes.status = 'error';
    },

    // Удаление статьи
    [fetchRemoveQuiz.pending]: (state, action) => {
      console.log(action)
      state.quizes.items = state.quizes.items.filter((obj) => obj._id !== action.meta.arg);
    },
  },
});

export const quizesReducer = quizesSlice.reducer;
