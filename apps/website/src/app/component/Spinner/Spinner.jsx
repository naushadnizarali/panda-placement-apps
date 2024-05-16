import React from 'react';
import { Spinner } from 'react-bootstrap';
import styles from './spinner.module.css';
function CustomSpinner({ width, color, height }) {
  return (
    <div>
      <>
        <Spinner
          className={styles?.customspinner}
          style={{
            color: color ? color : 'var(--primary-color)',
            width: width && width,
            height: height && height,
          }}
        />
      </>
    </div>
  );
}

export default CustomSpinner;
