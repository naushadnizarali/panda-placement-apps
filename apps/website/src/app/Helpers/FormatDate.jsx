export const formatDate = (inputDate) => {
  const dateObject = new Date(inputDate);
  const options = { month: 'long', day: 'numeric', year: 'numeric' };
  const formattedDate = dateObject
    .toLocaleDateString('en-US', options)
    .toUpperCase();
  return formattedDate;
};
