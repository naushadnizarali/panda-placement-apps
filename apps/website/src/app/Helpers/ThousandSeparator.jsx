// utils.js
export const addThousandSeparator = (value) =>
  value?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
