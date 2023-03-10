import QuizModel from "../models/Quiz.js";

export const getAll = async (req, res) => {
    try {
      const quizes = await QuizModel.find().populate('author').exec();
      res.json(quizes);
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: 'Не удалось получить квизы',
      });
    }
  };

  export const getOne = async (req, res) => {
    try {
      const quizId = req.params.id;
      const quiz = await QuizModel.find({_id: quizId}).populate('author').exec();
      const response = quiz[0]
      res.json(response);
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: 'Не удалось получить квиз',
      });
    }
  };


  export const getQuizesById = async (req, res) => {
    try {
      const quizes = await QuizModel.find({"author": req.userId}).populate('author').exec();
      res.json(quizes);
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: 'Не удалось получить квизы',
      });
    }
  };

  export const create = async (req, res) => {
    try {
      const doc = new QuizModel({
        name: req.body.name,
        questions: req.body.questions,
        author: req.userId,
        video: req.body.video,
        file: req.body.file,
        audio: req.body.audio,
        expDate: req.body.date
      });
  
      const quiz = await doc.save();
  
      res.json(quiz);
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: 'Не удалось создать квиз',
      });
    }
  };

  export const remove = async (req, res) => {
    try {
      const quizId = req.params.id;
  
      QuizModel.findOneAndDelete({_id: quizId,},
        (err, doc) => {
          if (err) {
            console.log(err);
            return res.status(500).json({
              message: 'Не удалось удалить статью',
            });
          }
  
          if (!doc) {
            return res.status(404).json({
              message: 'Статья не найдена',
            });
          }
  
          res.json({
            success: true,
          });
        },
      );
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: 'Не удалось получить статьи',
      });
    }
  };

  export const update = async (req, res) => {
    try {
      const quizId = req.params.id;
  
      await QuizModel.updateOne(
        {
          _id: quizId,
        },
        {
          name: req.body.name,
          questions: req.body.questions,
          video: req.body.video,
          file: req.body.file,
          audio: req.body.audio
        },
      );
  
      res.json({
        success: true,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: 'Не удалось обновить статью',
      });
    }
  };