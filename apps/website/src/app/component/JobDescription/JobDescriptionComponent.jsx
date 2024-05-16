// JobDescriptionComponent.js
import React, { useState } from 'react';
import DOMPurify from 'dompurify';
import styles from '../../pages/User/JobDetails/JobDetails.module.css';

const JobDescriptionComponent = ({ description, isblog, title }) => {
  const sanitizedDescription = DOMPurify.sanitize(description);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  const slicedDescription = showFullDescription
    ? sanitizedDescription
    : sanitizedDescription?.slice(0, 1000);

  return (
    <div className={styles.descriptionContainer}>
      {!isblog && <p className={styles.jobdesHeading}>Job Description</p>}
      <div
        dangerouslySetInnerHTML={{ __html: slicedDescription }}
        className={styles.jobdesdetail}
      />
      {sanitizedDescription && sanitizedDescription?.length > 1000 && (
        <button onClick={toggleDescription} className={styles.SeeMoreButtons}>
          {showFullDescription ? 'Read Less' : 'Read More'}
        </button>
      )}
    </div>
  );
};

export default JobDescriptionComponent;
