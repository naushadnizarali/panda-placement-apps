import React, { useEffect } from 'react';
import { useState } from 'react';
import styles from './Candidates.module.css';
import CandidateCard from '../../../component/Candidate/CandidateCard';
import { DynamicTitle } from '../../../Helpers/DynamicTitle';
import OffCanvasExample from '../../../component/FilterSidebar/FilterSidebar';

function Candidates({ isModal }) {
  const [specificlist, setspecificlist] = useState(false);

  useEffect(() => {
    DynamicTitle('Candidates-PandaPlacement');
  }, []);

  return (
    <div>
      {specificlist ? (
        <></>
      ) : (
        <>
          <div className={styles.dash}>
            <div className={styles['dashboard-outer']}>
              <div className={styles['widget-content']}>
                {!isModal && (
                  <div className={styles['upper-title-box']}>
                    <h3 style={{ paddingLeft: '2rem' }}>All Candidates!</h3>{' '}
                    <div className={styles.text}>
                      <p style={{ paddingLeft: '2rem' }}>
                        Ready to jump back in
                      </p>
                    </div>
                  </div>
                )}
                <CandidateCard />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Candidates;
