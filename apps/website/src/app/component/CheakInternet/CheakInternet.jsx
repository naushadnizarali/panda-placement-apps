import React from 'react';
import { Detector } from 'react-detect-offline';
import styles from './Cheak.module.css';
import Img from '../../../assets/nointernet.png';
const CheakInternet = (props) => {
  return (
    <Detector
      render={({ online }) =>
        online ? (
          props.children
        ) : (
          <div className={styles.wrapper}>
            <div className={styles.imgwrapper}>
              {/* Replace Img with the actual image source */}
              <img src={Img} alt="No Internet Connection Illustration" />
            </div>
            <h4>
              Oops! No Internet Connection
              <br />
              Please check your internet connection and try again.
              <br />
            </h4>
          </div>
        )
      }
    />
  );
};

export default CheakInternet;
