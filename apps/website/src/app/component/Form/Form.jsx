import React, { useState } from 'react';

const Form = ({ children, onSubmit }) => {
  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    if (value === '' || value === null || value === undefined) {
      return 'Please enter this field.';
    }
    return '';
  };

  const handleFieldChange = (name, value) => {
    const error = validateField(name, value);
    setErrors({ ...errors, [name]: error });
  };

  const handleFieldBlur = (e, name) => {
    handleFieldChange(name, e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let formErrors = {};
    React.Children.forEach(children, (child) => {
      const error = validateField(child.props.name, child.props.value);
      if (error) {
        formErrors[child.props.name] = error;
      }
    });

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
    } else {
      setErrors({});
      onSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {React.Children.map(children, (child) => {
        const name = child.props.name;
        return React.cloneElement(child, {
          errors: errors[name],
          onBlur: (e) => handleFieldBlur(e, name),
        });
      })}
    </form>
  );
};

export default Form;
