import React, { useState, useEffect } from 'react';
import { QuizData } from '../Data/QuizData';
import QuizResult from './QuizResult';

function Quiz() {
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [clickedOption, setClickedOption] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [timeLeft, setTimeLeft] = useState(10); // Time per question in seconds

    // Shuffle QuizData when the component mounts
    useEffect(() => {
        setQuestions(shuffleArray([...QuizData]));
    }, []);

    // Timer for each question
    useEffect(() => {
        if (timeLeft === 0) {
            changeQuestion(); // Move to the next question if time runs out
        }
        
        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(timer); // Cleanup on unmount or question change
    }, [timeLeft, currentQuestion]);

    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };

    const changeQuestion = () => {
        updateScore();
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setClickedOption(0);
            setTimeLeft(10); // Reset timer for the next question
        } else {
            setShowResult(true);
        }
    };

    const updateScore = () => {
        if (clickedOption === questions[currentQuestion].answer) {
            setScore(score + 1);
        }
    };

    const resetAll = () => {
        setShowResult(false);
        setCurrentQuestion(0);
        setClickedOption(0);
        setScore(0);
        setTimeLeft(10);
        setQuestions(shuffleArray([...QuizData])); // Reshuffle questions on restart
    };

    return (
        <div>
            <p className="heading-txt">Quiz APP</p>
            <div className="container">
                {showResult ? (
                    <QuizResult score={score} totalScore={questions.length} tryAgain={resetAll} />
                ) : (
                    <>
                        <div className="question">
                            <span id="question-number">{currentQuestion + 1}. </span>
                            <span id="question-txt">{questions[currentQuestion]?.question}</span>
                        </div>
                        <div className="option-container">
                            {questions[currentQuestion]?.options.map((option, i) => (
                                <button
                                    className={`option-btn ${
                                        clickedOption === i + 1 ? 'checked' : null
                                    }`}
                                    key={i}
                                    onClick={() => setClickedOption(i + 1)}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                        <div className="timer">Time left: {timeLeft} seconds</div>
                        <input type="button" value="Next" id="next-button" onClick={changeQuestion} />
                    </>
                )}
            </div>
        </div>
    );
}

export default Quiz;
