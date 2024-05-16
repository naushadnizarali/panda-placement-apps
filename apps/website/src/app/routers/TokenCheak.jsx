import React from 'react';
import jwt from 'jsonwebtoken';

const isTokenExpired = (token) => {
  if (!token) {
    return true; // Token missing
  }

  try {
    const decodedToken = jwt.decode(token);
    if (!decodedToken || decodedToken.exp * 1000 < Date.now()) {
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error decoding token:', error);
    return true;
  }
};

export default isTokenExpired;
