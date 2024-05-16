import React, { useEffect, useState } from 'react';
import { Fade } from 'react-reveal';
import CustomSpinner from '../Spinner/Spinner';
import styles from './PopularJobCategories.module.css';
import {
  FaAccusoft,
  FaChartBar,
  FaCubes,
  FaRegWindowRestore,
  FaRobot,
  FaShoppingBag,
  FaSun,
  FaWindowRestore,
} from 'react-icons/fa';

function PopularJobCategory({ data }) {
  const [isloading, setisloading] = useState(true);

  const availableIcons = [
    FaShoppingBag,
    FaChartBar,
    FaCubes,
    FaWindowRestore,
    FaSun,
    FaAccusoft,
    FaCubes,
    FaWindowRestore,
    FaRegWindowRestore,
  ];

  useEffect(() => {
    setisloading(false);
  }, [data]);

  return (
    <>
      <div className={styles.heading}>
        <h2>Popular Job Categories</h2>
        <p>2020 jobs live - 293 added today.</p>
      </div>
      <Fade bottom>
        <div className={styles.Catogarymaindiv}>
          <div className={styles.warapper}>
            {isloading ? (
              <CustomSpinner />
            ) : data?.length === 0 ? (
              <p>Categories Not Found!</p>
            ) : (
              data &&
              data?.map((e, i) => (
                <div className={styles['popular-job-category']} key={i}>
                  <div className={styles['icon-bg']}>
                    {React.createElement(availableIcons[i], {
                      className: styles['icon'],
                    })}
                  </div>
                  <div className={styles['category-info']}>
                    <h2 className={styles['title']}>{e.title}</h2>
                    <p className={styles['opening']}>
                      {`(${e?.opening} positions)`}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </Fade>
    </>
  );
}

export default PopularJobCategory;
