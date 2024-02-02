import express from 'express';
import fs from 'fs';
import multer from 'multer';
import cors from 'cors';

import mongoose from 'mongoose';

import { registerValidation, loginValidation } from './validations.js';

import { handleValidationErrors, checkAuth } from './utils/index.js';

import { QuizControler, ResultsController, UserController } from './controllers/index.js';

mongoose
  .connect("mongodb://localhost:27017/")
  .then(() => console.log('DB ok'))
  .catch((err) => console.log('DB error', err));

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    if (!fs.existsSync('uploads')) {
      fs.mkdirSync('uploads');
    }
    cb(null, 'uploads');
  },
  filename: (_, file, cb) => {
    console.log(file, cb);
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);

app.post('/upload', checkAuth, upload.single('file'), (req, res) => {
  console.log(req.file.originalname)
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.get('/getTeachers', UserController.getTeachers);

app.get('/quizes', QuizControler.getAll);
app.get('/quizes/myquizes', checkAuth, QuizControler.getQuizesById);
app.get('/quizes/typeAndLevel', QuizControler.getQuizesByTypeAndLevel);
app.get('/quizes/:id', checkAuth, QuizControler.getOne);

app.post('/quizes', checkAuth, handleValidationErrors, QuizControler.create);
app.delete('/quizes/:id', checkAuth, QuizControler.remove);
app.patch(
  '/quizes/:id',
  checkAuth,
  handleValidationErrors,
  QuizControler.update
  );
app.post('/quizes/lock/:id', checkAuth, QuizControler.lockQuiz);
app.post('/quizes/unlock/:id', checkAuth, QuizControler.unlockQuiz);

app.get('/results/:id', checkAuth, ResultsController.getResultsByQuizId);
app.post('/results/:id', checkAuth, ResultsController.create);
app.get('/resultsByUser/:id', checkAuth, ResultsController.getResultByUserId);
app.delete('/results/:id', checkAuth, ResultsController.remove);


app.listen(8000, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log('Server OK');
});