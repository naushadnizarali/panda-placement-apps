import React from 'react';
import styles from './StatisticsCard.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-regular-svg-icons';
import { Button } from 'react-bootstrap';
import { faBriefcase } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

function StatisticsCard({
  totalapplications,
  totaljobs,
  approved,
  unapproved,
  pending,
  complete,
}) {
  const navigate = useNavigate();
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Statistics</h2>
      <div className={`${styles.card} bg-[var(--see-green)]`}>
        <FontAwesomeIcon color="white" icon={faCopy} fontSize={50} />
        <p style={{ marginTop: 16 }}>Total Applications</p>
        <p style={{ marginTop: 16, fontWeight: '700' }}>{totalapplications}</p>
      </div>
      <div className={`${styles.card} bg-[var(--see-green)]`}>
        <div className={styles.middleCard}>
          <div className="ml-8 mr-8">
            <FontAwesomeIcon color="white" icon={faCopy} fontSize={50} />
            <p style={{ marginTop: 16 }}>Total Jobs</p>
            <p style={{ marginTop: 16, fontWeight: '700' }}>{totaljobs}</p>
          </div>
          <div className="text-left w-full ml-8 mr-4 bg-slate-000">
            <div className="flex items-center justify-around ">
              <p>Pending</p>
              <p style={{ fontWeight: '700' }}>{pending}</p>
            </div>
            <div className="flex items-center justify-around">
              <p>Approved</p>
              <p style={{ fontWeight: '700' }}>{approved}</p>
            </div>
            <div className="flex items-center justify-around">
              <p>Unapproved</p>
              <p style={{ fontWeight: '700' }}>{unapproved}</p>
            </div>
            <div className="flex items-center justify-around">
              <p>Complete</p>
              <p style={{ fontWeight: '700' }}>{complete}</p>
            </div>
          </div>
        </div>
      </div>
      <div className={`${styles.cardlast} bg-[var(--see-green)]`}>
        <div className="flex items-center flex-col justify-center mt-4">
          <FontAwesomeIcon color="white" icon={faBriefcase} fontSize={50} />
        </div>
      </div>
    </div>
  );
}

export default StatisticsCard;
