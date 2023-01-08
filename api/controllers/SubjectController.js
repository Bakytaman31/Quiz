
import SubjectModel from "../models/Subject.js";

export const getAll = async (req, res) => {
    try {
      const subjects = await SubjectModel.find();
      res.json(subjects);
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

  export const create = async (req, res) => {
    try {
      const doc = new QuizModel({
        name: req.body.name
      });
  
      const subject = await doc.save();
  
      res.json(subject);
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
  
      QuizModel.findOneAndDelete(
        {
          _id: quizId,
        },
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