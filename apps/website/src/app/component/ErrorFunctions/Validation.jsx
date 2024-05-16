import Toast from '../Toast/Toast';

const formatFieldName = (fieldName) => {
  return fieldName
    .replace(/_/g, ' ') // Replace underscores with spaces
    .replace(/\b\w/g, (match) => match.toUpperCase()); // Capitalize the first letter of each word
};

const checkEmptyFields = (data) => {
  const emptyFields = [];

  Object.entries(data).forEach(([key, value]) => {
    if (typeof value === 'string' && value.trim() === '') {
      emptyFields.push(formatFieldName(key));
    } else if (value instanceof Date && isNaN(value.getTime())) {
      emptyFields.push(formatFieldName(key));
    }
  });

  if (emptyFields.length > 0) {
    const errorMessage =
      emptyFields.length === 1
        ? `Please fill the ${emptyFields[0]} field.`
        : `Please fill the following fields: ${emptyFields.join(', ')}.`;
    Toast.error(errorMessage);
    return false;
  }
  return true;
};

export default checkEmptyFields;
