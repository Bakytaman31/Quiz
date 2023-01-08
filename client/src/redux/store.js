import { configureStore } from '@reduxjs/toolkit';
import { quizesReducer } from './slices/quizes';
import { authReducer } from './slices/auth';

const store = configureStore({
  reducer: {
    quizes: quizesReducer,
    auth: authReducer,
  },
});

export default store;
