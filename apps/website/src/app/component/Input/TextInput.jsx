import React from 'react';
import styles from './styles.module.css';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from '@mui/material';

const Input = ({
  placeholder,
  type,
  onChange,
  borderradius,
  padding,
  fontSize,
  name,
  value,
  borderWidth,
  marginTop,
  required,
  marginLeft,
  marginRight,
}) => {
  return (
    <input
      className={styles.input}
      type={type}
      placeholder={placeholder}
      onChange={onChange}
      name={name}
      required={required}
      value={value}
      style={{
        borderRadius: borderradius && borderradius,
        padding: padding && padding,
        fontSize: fontSize && fontSize,
        borderWidth: borderWidth && borderWidth,
        marginTop: marginTop && marginTop,
        marginLeft: marginLeft && marginLeft,
        marginRight: marginRight && marginRight,
      }}
    />
  );
};

const ResumeInput = ({
  placeholder,
  type,
  onChange,
  borderradius,
  padding,
  fontSize,
  name,
  value,
  borderWidth,
  marginTop,
  marginLeft,
  marginRight,
  height,
  width,
  required,
  errors,
  borderColor,
  backgroundColor,
  thousandSeparator,
  disabled,
}) => {
  const addCommas = (value) =>
    value?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const handleChange = (event) => {
    let inputValue = event.target.value;
    if (thousandSeparator) {
      // Remove non-numeric characters
      inputValue = inputValue.replace(/[^0-9]/g, '');
    }

    // Apply thousand separator
    const formattedValue = thousandSeparator
      ? addCommas(inputValue)
      : inputValue;

    // Call the provided onChange function with the formatted value
    onChange({ target: { name, value: formattedValue } });
  };

  return (
    <>
      <input
        disabled={disabled}
        className={styles.resumeInput}
        type={type}
        placeholder={placeholder}
        // onChange={onchange}
        onChange={handleChange}
        required={required}
        name={name}
        value={thousandSeparator ? addCommas(value) : value}
        style={{
          borderRadius: borderradius && borderradius,
          padding: padding && padding,
          height: height && height,
          fontSize: fontSize && fontSize,
          borderWidth: borderWidth && borderWidth,
          marginTop: marginTop && marginTop,
          marginLeft: marginLeft && marginLeft,
          marginRight: marginRight && marginRight,
          width: width && width,
          borderColor: borderColor && borderColor,
          backgroundColor: backgroundColor && backgroundColor,
        }}
      />
      {errors && <p>{errors}</p>}
    </>
  );
};

const ResumeSelect = ({
  title,
  options,
  onChange,
  value,
  marginLeft,
  marginRight,
  padding,
  name,
  width,
  required,
  errors,
  disabled,
  filterelement,
  backgroundColor,
  isStatus,
}) => {
  return (
    <FormControl
      className={`${styles.resumeselect} flex flex-col`}
      style={{
        marginLeft: marginLeft && 0,
        marginRight: marginRight && 0,
        width: width && width,
        backgroundColor: backgroundColor && backgroundColor,
      }}
      variant="outlined"
      fullWidth
      disabled={disabled}
    >
      {!isStatus ? (
        <></>
      ) : (
        <InputLabel id={`${name}-label`}>{title}</InputLabel>
      )}
      <Select
        inputProps={{ 'aria-label': 'Without label' }}
        labelId={`${name}-label`}
        required={required}
        onChange={onChange}
        name={name}
        value={value}
        style={{
          padding: padding && padding,
          width: width && width,
        }}
        // label={title}
      >
        {options &&
          options?.map((option, index) => (
            <MenuItem key={index} value={option?.value}>
              {option?.label}
            </MenuItem>
          ))}
        {/* <MenuItem value="">Others</MenuItem> */}
      </Select>
      {errors && <FormHelperText error>{errors}</FormHelperText>}
    </FormControl>
  );
};

export { Input, ResumeInput, ResumeSelect };

// Table
