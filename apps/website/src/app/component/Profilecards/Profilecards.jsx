import React from 'react';
import { FaEdit } from 'react-icons/fa';
import { ImBin } from 'react-icons/im';
import styles from './Profilecards.module.css';

function Profilecards({ data, onEdit, onDelete }) {
  return (
    <>
      {data &&
        data?.map((e, i) => (
          <div key={e.id} className={styles.resume_block}>
            <div className={styles.inner}>
              <span className={styles.name}>
                {e?.degree?.slice(0, 1) ?? '----'}
              </span>
              <div className={styles.title_box}>
                <div className={styles.info_box}>
                  <h5>{e?.degree ?? '----'}</h5>
                  <span>{e.institute ?? '----'}</span>
                  <p>{e?.location ?? '----'}</p>
                </div>
                <div className={styles.edit_box}>
                  <span className={styles.year}>
                    {e?.start_period?.slice(0, 4) ? e?.start_period : '----'}-
                    {e?.currently_enrolled
                      ? 'Ongoing'
                      : e?.complete_period?.slice(0, 4)
                        ? e.complete_period
                        : '----'}
                  </span>
                  <div className={styles.edit_btns}>
                    <button className={styles.icons}>
                      <ImBin
                        style={{ color: 'red', width: '100%' }}
                        // icon={faTrashCan}
                        onClick={() => onDelete(e.id)}
                      />
                    </button>
                    <button className={styles.icons}>
                      <FaEdit
                        style={{ color: 'green', width: '100%' }}
                        onClick={() => onEdit(e)}
                        // icon={faPenToSquare}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
    </>
  );
}

export default Profilecards;
