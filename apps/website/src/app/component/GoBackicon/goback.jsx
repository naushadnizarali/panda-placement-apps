import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PiArrowCircleLeftLight } from 'react-icons/pi';

function Goback({ onClick, margin }) {
  const naviagte = useNavigate();

  const handlenaviagtion = () => {
    naviagte(-1);
  };
  return (
    <div
      onClick={handlenaviagtion}
      // style={{
      //   border: "1px solid black",
      //    width: "2%",
      //   display: "flex",
      //   alignItems: "center",
      //   justifyContent: "center",
      //   padding: ".5rem 1rem .5rem 1rem",
      //   borderRadius: "20px",
      //   cursor: "pointer",
      //   margin: margin && margin,
      // }}
    >
      <PiArrowCircleLeftLight
        size={40}
        style={{
          cursor: 'pointer',
        }}
      />
    </div>
  );
}

export default Goback;
