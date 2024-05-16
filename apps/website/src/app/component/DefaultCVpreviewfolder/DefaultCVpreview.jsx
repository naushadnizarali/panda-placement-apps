import React from 'react';
import styles from '../DefaultCVpreviewfolder/DefaultCVpreview.module.css';

function DefaultCVpreview() {
  return (
    <>
      <div className={styles.mainDiv}>
        <div className={styles.noise}></div>
        <div className={styles.overlay}></div>
        <div className={styles.terminal}>
          <h1>
            Error <span className={styles.errorcode}>404</span>
          </h1>
          <p className={styles.output}>
            The page you are looking for might have been removed, had its name
            changed, or is temporarily unavailable.
          </p>
          <p className={styles.output}>
            Please try to <a href="/">go back</a> or{' '}
            <a href="/">return to the homepage</a>.
          </p>
          <p className={styles.output}>Good luck.</p>
        </div>
      </div>
    </>
  );
}

export default DefaultCVpreview;
