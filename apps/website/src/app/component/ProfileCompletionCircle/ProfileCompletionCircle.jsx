// ProfileCompletionCircle.jsx

import React from 'react';
import PropTypes from 'prop-types';
import './ProfileCompletionCircle.css';

const ProfileCompletionCircle = ({ completionPercentage }) => {
  return (
    <div className="profile-circle">
      <div className="percentage">{`${completionPercentage}%`}</div>
      <div
        className="progress-bar"
        style={{ '--completion': completionPercentage }}
      ></div>
    </div>
  );
};

ProfileCompletionCircle.propTypes = {
  completionPercentage: PropTypes.number.isRequired,
};

export default ProfileCompletionCircle;
