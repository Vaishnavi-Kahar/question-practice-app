import React, { useState, useEffect } from "react";
import "./Home.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark as regularBookmark } from "@fortawesome/free-regular-svg-icons";
import {
  faChevronLeft,
  faChevronRight,
  faBookmark as solidBookmark,
} from "@fortawesome/free-solid-svg-icons";
import {
  faArrowRightLong,
  faArrowLeftLong,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

import FormControl from "@mui/material/FormControl";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
const apiUrl = process.env.REACT_APP_API_URL;

function Home() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [showSolution, setShowSolution] = useState(false);
  const [showAnswerPopup, setShowAnswerPopup] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(`${apiUrl}/question`);
        const data = await response.json();
        setQuestions(data);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();

    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 768);
    };

    // Add event listener for resize
    window.addEventListener("resize", handleResize);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleBookmarkToggle = () => {
    setIsBookmarked((prevIsBookmarked) => !prevIsBookmarked);
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedOption("");
      setShowSolution(false);
      setShowAnswerPopup(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption("");
      setShowSolution(false);
      setShowAnswerPopup(false);
    }
  };

  const handleCheckSolution = () => {
    setShowSolution(true);
    setShowAnswerPopup((prevShowAnswerPopup) => !prevShowAnswerPopup);
    setSelectedOption((prevSelectedOption) => !prevSelectedOption);
  };

  const toggleAnswerPopup = () => {
    setShowAnswerPopup((prevShowAnswerPopup) => !prevShowAnswerPopup);
  };

  return (
    <div className="home">
      <div
        className="main-content"
        style={
          isSmallScreen && showAnswerPopup
            ? {
                filter: "blur(1px)",
                zIndex: 999,
                position: "relative",
              }
            : {}
        }
      >
        <div className="title">
          {isSmallScreen && (
            <FontAwesomeIcon
              icon={faChevronLeft}
              onClick={handlePrevQuestion}
              style={{ cursor: "pointer" }}
            />
          )}
          <div className="innerTitle">
            <h2 className="question-title">
              Question {currentQuestionIndex + 1}
            </h2>
            <FontAwesomeIcon
              icon={isBookmarked ? solidBookmark : regularBookmark}
              onClick={handleBookmarkToggle}
              style={{ cursor: "pointer", height: "20px" }}
            />
          </div>

          {isSmallScreen && (
            <FontAwesomeIcon
              icon={faChevronRight}
              onClick={handleNextQuestion}
              style={{ cursor: "pointer" }}
            />
          )}
        </div>

        <strong>{questions[currentQuestionIndex]?.question}</strong>
        {questions[currentQuestionIndex]?.image && (
          <img
            src={questions[currentQuestionIndex]?.image}
            className="question-image"
            alt="questionImage"
          />
        )}
        <FormControl component="fieldset">
          <RadioGroup
            className="form-container"
            aria-label="quiz"
            name="quiz"
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
          >
            <Grid container spacing={1}>
              {questions[currentQuestionIndex]?.options.map((option, idx) => (
                <Grid item xs={12} md={6} key={idx}>
                  <FormControlLabel
                    className="option-item"
                    value={option}
                    control={<Radio />}
                    label={option}
                    disabled={showSolution}
                  />
                </Grid>
              ))}
            </Grid>
          </RadioGroup>
        </FormControl>
        <div className="grid">
          {!isSmallScreen && (
            <button
              type="button"
              className="btn btn-outline-secondary myButtons"
              disabled={currentQuestionIndex === 0}
              onClick={handlePrevQuestion}
            >
              <FontAwesomeIcon
                style={{ marginRight: "10px" }}
                icon={faArrowLeftLong}
              />
              Previous
            </button>
          )}

          <div className="inner-buttons">
            <button
              type="button"
              className="btn btn-outline-secondary myButtons"
              onClick={handleCheckSolution}
            >
              Check Solution
            </button>
            <button type="button" className="btn btn-primary myButtons">
              Submit Answer
            </button>
          </div>
          {!isSmallScreen && (
            <button
              type="button"
              className="btn btn-outline-secondary myButtons"
              disabled={currentQuestionIndex === questions.length - 1}
              onClick={handleNextQuestion}
            >
              Skip
              <FontAwesomeIcon
                style={{ marginLeft: "2px" }}
                icon={faArrowRightLong}
              />
            </button>
          )}
        </div>
      </div>
      {showAnswerPopup && (
        <div className="answer-popup">
          <div className="answer-header">
            <span className="close-icon" onClick={toggleAnswerPopup}>
              <FontAwesomeIcon cursor="pointer" icon={faTimes} />
            </span>
          </div>
          <div className="answer-content">
            <p>
              <strong>Correct Answer :</strong>{" "}
              {questions[currentQuestionIndex]?.answer.option}
              <br />
              <strong>Explanation: </strong>
              {questions[currentQuestionIndex]?.answer.explanation}
            </p>
            {questions[currentQuestionIndex]?.answer.image && (
              <img
                src={questions[currentQuestionIndex]?.answer.image}
                className="answer-image"
                alt="SolutionImage"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
