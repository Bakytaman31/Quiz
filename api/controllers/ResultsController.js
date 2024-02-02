import ResultsModel from "../models/Results.js";

  export const getResultsByQuizId = async (req, res) => {
    try {
      const quizId = req.params.id;
  
      const results = await ResultsModel.find({ quiz: quizId}).populate('user');
      res.json(results);
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: 'Не удалось получить результаты',
      });
    }
  };

  export const getResultByUserId = async (req, res) => {
    try {
      const quizId = req.params.id;
      const results = await ResultsModel.find({ quiz: quizId, user: req.userId}).populate('user');
      results.length > 0 ? res.json(results[0]) : res.json(false);
    } catch (err) {
      res.status(500).json({
        message: 'Не удалось получить результаты',
      });
    }
  }

  export const create = async (req, res) => {
    try {
        const quizId = req.params.id;
        console.log(req.body.esse)
        const doc = new ResultsModel({
        quiz: quizId,
        user: req.userId,
        result: req.body.result,
        esse: req.body.esse,
      });
  
      const result = await doc.save();
  
      res.json(result);
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: 'Не удалось создать результаты',
      });
    }
  };

  export const remove = async (req, res) => {
    try {
      const resultId = req.params.id;
      console.log(req.params.id)
      await ResultsModel.deleteOne({ _id:resultId });
      res.json(true);

    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: 'Не удалось удалить результат',
      });
    }
  }