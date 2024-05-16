import React from 'react';
import styles from './Companies.module.css';
import frame1 from '../../assets/Frame1.png';
import frame2 from '../../assets/Frame2.png';
import frame3 from '../../assets/Frame3.png';
import frame4 from '../../assets/Frame4.png';
import Marquee from 'react-marquee-slider';

function Companies() {
  const slides = [frame1, frame2, frame3, frame4, frame2, frame3, frame4];

  return (
    <div className={styles.Companies}>
      <div className={styles.title}>
        <h1>Top Companies</h1>
      </div>
      <div className={styles.slider}>
        <div className={styles.controls}>
          <div className={`${styles.slideContainer} ${styles.rowContainer}`}>
            <Marquee velocity={80} direction="ltr">
              {slides &&
                slides.map((slide, index) => (
                  <img
                    src={slide}
                    alt={`Slide ${index}`}
                    className={styles.slideImage}
                  />
                ))}
            </Marquee>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Companies;
