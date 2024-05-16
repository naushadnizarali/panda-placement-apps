import React, { useEffect, useState } from 'react';
import style from '../TimerPage/TimerPage.module.css';
import topimg from '../../../../assets/3275434.jpg';
import { Fade } from 'react-reveal';

function TimerPage({ isShowTimer, SpecialText }) {
  const [showTimer, setshowTimer] = useState(isShowTimer);
  const [timer, setTimer] = useState(900);

  useEffect(() => {
    let countdown;
    if (showTimer) {
      countdown = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }

    return () => {
      clearInterval(countdown);
    };
  }, [showTimer]);

  useEffect(() => {
    if (timer <= 0) {
      setshowTimer(false);
      //   navigate("/user/home");
    }
  }, [timer]);

  return (
    <div className={style.TimerPage_main}>
      <Fade top>
        <div className={style.TimerPage}>
          <div className="flex justify-center">
            <img
              src={topimg}
              alt="icon representing email confirmation"
              className="mb-4"
              width={200}
            />
          </div>
          <h2 className="text-2xl font-semibold text-center text-gray-700 mb-4">
            Email Confirmation
          </h2>
          {/* <p>
          Please Check And Spam Folder{" "}
          <span style={{ fontWeight: "bold" }}>
            To Activate </span>
           Your PandaPlacement Account
        </p> */}
          <p>
            {SpecialText} <br />
            <b>
              Link Expire In {Math.floor(timer / 60)}:
              {(timer % 60).toString().padStart(2, '0')}
            </b>
          </p>
          <hr className="mb-6" />
          <a href="/" className={style.gotohome}>
            Go to Home
          </a>
        </div>
      </Fade>

      {/*
      <div className="d-none">
        <p>
          Please Check Email And Spam Folder{" "}
          <span style={{ fontWeight: "bold" }}>
            To Activate Your PandaPlacement Account
          </span>
        </p>
        <p>
          {SpecialText} <br />
          <b>
            Link Expire In {Math.floor(timer / 60)}:
            {(timer % 60).toString().padStart(2, "0")}
          </b>
        </p>
        <h6>OR</h6>
        <a href="/">Go to Home</a>
      </div> */}
    </div>
  );
}

export default TimerPage;
