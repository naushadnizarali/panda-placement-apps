import React from 'react';
import { Fade } from 'react-reveal';
import Candidates from '../../pages/Employer/Candidates/Candidates';
import Jobs from '../../pages/Employer/Jobs/Jobs';
import OffCanvasExample from '../FilterSidebar/FilterSidebar';
import CustomSpinner from '../Spinner/Spinner';
import StatisticsCardModalData from '../StatisticsCardModalData/StatisticsCardModalData';
import styles from './Employee.module.css'; // Import the CSS module
function PopularJobCategory({ employerstats, loading }) {
  const componentMap = {
    'Posted Jobs': <Jobs isModal={true} />,
    'Total Applications': <Candidates isModal={true} />,
    'Approved Jobs': (
      <StatisticsCardModalData title2="Approved Jobs" Status="Approved" />
    ),
    'Rejected Jobs': (
      <StatisticsCardModalData title2="Rejected Jobs" Status="Unapproved" />
    ),
    'Pending Jobs': (
      <StatisticsCardModalData title2="Pending Jobs" Status="Pending" />
    ),
    'Expire Jobs': (
      <StatisticsCardModalData title2="Expired Jobs" Status="Expired" />
    ),
    'Open Jobs': <StatisticsCardModalData title2="Open Jobs" Status="Open" />,
    'Close Jobs': (
      <StatisticsCardModalData title2="Close Jobs" Status="Close" />
    ),
  };

  return (
    <div>
      <h2 className="text-center mb-[2rem]">Statistics</h2>
      <div className={styles.warapper}>
        {employerstats &&
          employerstats?.map((items, index) => (
            <Fade bottom className={styles.ui_block}>
              <div className={styles.ui_item}>
                <div
                  className={items?.color}
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <OffCanvasExample
                    icons={<div>{items.icon}</div>}
                    width="70%"
                    key={index}
                    name={items.label}
                  >
                    {componentMap[items.label] || null}
                  </OffCanvasExample>
                </div>

                <div className={styles.right}>
                  {loading ? (
                    <CustomSpinner />
                  ) : (
                    <h2 className={items?.style}>{items?.property}</h2>
                  )}
                  <p className={styles['opening']}>{items?.label}</p>
                </div>
              </div>
            </Fade>
          ))}
      </div>
    </div>
  );
}

export default PopularJobCategory;
