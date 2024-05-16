import React from 'react';
import styles from './styles.module.css';

const CustomButton = ({
  label,
  width,
  onClick,
  icon,
  backgroundcolor,
  textcolor,
  border,
  radius,
  height,
  marginTop,
  boxShadow,
  disabled,
}) => {
  return (
    <button
      className={styles.btn}
      onClick={onClick && onClick}
      disabled={disabled}
      style={{
        width: width && width,
        backgroundColor: backgroundcolor
          ? backgroundcolor
          : disabled
            ? 'gray'
            : '',
        color: textcolor ? textcolor : '',
        border: border ? border : '',
        borderRadius: radius && radius,
        height: height && height,
        marginTop: marginTop ? marginTop : '',
        boxShadow: boxShadow ? boxShadow : '',
      }}
    >
      {icon && (
        <span
          style={{
            position: 'relative',
            bottom: '1px',
            // right: 5,
          }}
        >
          {icon}
        </span>
      )}
      {label}
    </button>
  );
};

export default CustomButton;
