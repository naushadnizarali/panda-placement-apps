// DatePicker.js

import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function MyDatePicker({
  placeholderText,
  onChange,
  name,
  selectedDate,
  borderradius,
  padding,
  fontSize,
  borderWidth,
  marginTop,
  marginLeft,
  marginRight,
  height,
  width,
}) {
  return (
    <DatePicker
      selected={selectedDate}
      onChange={onChange}
      name={name}
      placeholderText={placeholderText}
      dateFormat="dd/MM/yyyy"
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
        backgroundcolor: 'red',
      }}
    />
  );
}

export default MyDatePicker;
