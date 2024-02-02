import React from 'react';
import TextField from '@mui/material/TextField';
import { useTranslation } from 'react-i18next';
import Button from '@mui/material/Button';

export const Questions = ({
    question,
    answers,
    rightAnswer,
    type,
    number,
    questionHandler,
    answerHandler,
    rightAnswerHandler,
    addAnswer,
    deleteAnswer
}) => {
    const {t} = useTranslation();

    const standardQuestion = (
      <div key={number} style={{marginTop: "20px"}}>
          <TextField
        variant="outlined"
        placeholder={t('question')}
        value={question} 
        onChange={(e) => questionHandler(number, e.target.value)}
        fullWidth
      />
      {
        answers.map((answer, j) => (
          <div key={j}>
              <TextField
                variant="outlined"
                placeholder={t('answer')}
                value={answer} 
                onChange={(e) => answerHandler(number, j, e.target.value)}
                fullWidth
      />
          </div>
        ))
      }
      <TextField
        variant="outlined"
        placeholder={t('rightAnswer')}
        value={rightAnswer} 
        onChange={(e) => rightAnswerHandler(number, e.target.value)}
        fullWidth
      />
      </div>
      );

    const missedWordQuestion = (
      <div key={number} style={{marginTop: "20px"}}>
        <TextField
        variant="outlined"
        placeholder={t('question')}
        value={question} 
        onChange={(e) => questionHandler(number,e.target.value)}
        fullWidth
      />
      {
        answers.map((answer, j) => (
          <div key={j}>
              <TextField
                variant="outlined"
                placeholder={t('answer')}
                value={answer} 
                onChange={(e) => answerHandler(number, j, e.target.value)}
                fullWidth
      />
          </div>
        ))
      }
      <Button
        variant="contained"
        component="label"
        style={{marginTop: "20px", marginBottom: "20px"}}
        onClick={() => addAnswer(number)}>
          Add answer
        </Button>
        <Button
        variant="contained"
        component="label"
        color="error"
        style={{marginTop: "20px", marginBottom: "20px", marginLeft: "10px"}}
        onClick={() => deleteAnswer(number)}>
          Remove answer
        </Button>
      <TextField
        variant="outlined"
        placeholder={t('rightAnswer')}
        value={rightAnswer} 
        onChange={(e) => rightAnswerHandler(number, e.target.value)}
        fullWidth
      />
      </div>
    );

    const esse = (
      <div key={number} style={{marginTop: "20px"}}>
        <TextField
          variant="outlined"
          placeholder={t('question')}
          value={question}
          onChange={(e) => questionHandler(number, e.target.value)}
          fullWidth
        />
      </div>
    );

    const highlightWord = (
      <div key={number} style={{marginTop: "20px"}}>
        <TextField
          variant="outlined"
          placeholder={t('question')}
          value={question}
          onChange={(e) => questionHandler(number, e.target.value)}
          fullWidth
        />
        <TextField
        variant="outlined"
        placeholder="Text"
        fullWidth
      />
        <TextField
        variant="outlined"
        placeholder={t('rightAnswer')}
        value={rightAnswer} 
        onChange={(e) => rightAnswerHandler(number, e.target.value)}
        fullWidth
      />
      </div>
    );

    switch(type) {
        case "standart":
            return standardQuestion;
        case "missedWord":
            return missedWordQuestion;
        case "esse":
            return esse;
        case "highlightWord":
            return highlightWord;
        default:
            return ""
            
    }
}
