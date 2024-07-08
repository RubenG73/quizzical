import React from "react";
import { useState, useEffect } from "react";
import Menu from "./assets/Menu";
import Question from "./assets/Question";
import { nanoid } from "nanoid";

export default function App() {
  const [started, setStarted] = useState(false)
  const [count, setCount] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [checked, setChecked] = useState(false)
  const [questions, setQuestions] = useState([])

  const shuffleArray = (arr) => arr.sort(() => Math.random() - 0.5)

  useEffect(() => {
    async function getQuestion() {
      const res = await fetch('https://opentdb.com/api.php?amount=5&category=15&type=multiple')
      const data = await res.json()
      let q = []
      data.results.forEach(question => {
        q.push({id: nanoid(), answers: shuffleArray([...question.incorrect_answers, question.correct_answer]), question: question.question, correct: question.correct_answer, selected: null, checked: false})
      })
      setQuestions(q);
    }
    getQuestion()
  } , [count])


  function handleCheck() {
    let selected = true
    questions.forEach(question => {
      if(question.selected === null) {
        selected = false
        return
      }
    })
    if(!selected) {
      return
    }
    setQuestions(questions => questions.map(question => {
      return{...question, checked:true}
    }))
    setChecked(true)
    let correct = 0
    questions.forEach(question => {
      if(question.correct === question.selected) {
        correct += 1
      }
    })
    setCorrect(correct)
  }

  function handleClickAnswer(id, answer) {
    setQuestions(questions => questions.map(question => {
      return question.id === id ? {...question, selected:answer} : question
    }))
  }

  function handlePlayAgain(){
    setCount(count => count + 1)
    setChecked(false)
  }

  const questionsElements = questions ? questions.map(question => {
    return <Question 
            key = {question.id}
            q = {question}
            handleClickAnswer = {handleClickAnswer}
            id = {question.id}
          />
  }) : []

  function start() {
    setStarted(x => !x)
  }

  return(
    <div className="main-container">
      <div className="content-container">
        {
          started ?
          <div className="start-content-container">
            {questionsElements}
            <div className="end-div">
              {checked && <span className="score">You scored {correct}/5 correct answers</span>}
              <button className="check" onClick={checked ? handlePlayAgain : handleCheck}>{checked ? 'Play Again' : 'Check Answer'}</button>
            </div>
          </div>
          :
          <Menu 
            start = {start}
          />
        }
      </div>
    </div>
  )
}