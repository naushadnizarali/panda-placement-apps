import React from 'react';
import styles from './Reviews.module.css';
import RightImage from '../../assets/right_image.png';
import logo1 from '../../assets/userone.png';
function Reviews() {
  return (
    <>
      <div>
        <h1 className={styles.reviewheading}>People Review about Rozab</h1>
        <section className="Review-box container mb-3">
          <div className="row flex items-center">
            <div className="col-md-8">
              <div className={styles.banner}>
                <img src={RightImage} width="100%" className="img-fluid" />
              </div>
            </div>
            <div className="col-md-4">
              <div className={` bg-white rounded mb-3 pt-3  ps-3`}>
                <div className="review-img d-flex align-items-center">
                  <img src={logo1} width="50px" className="me-2" />
                  <h2 className="text-end fs-4 text-zinc-500">Qasim A.</h2>
                </div>
                <div className={`${styles.review} pt-3 pb-5`}>
                  <p className="mb-0 fs-5">
                    Phil really made it feel like someone else was taking this
                    job search as seriously as I was.
                  </p>
                </div>
              </div>

              <div className={` bg-white rounded mb-3 pt-3  ps-3`}>
                <div className="review-img d-flex align-items-center">
                  <img src={logo1} width="50px" className="me-2" />
                  <h2 className="text-end fs-4 text-zinc-500 ">Qasim A.</h2>
                </div>
                <div className={`${styles.review} pt-3 pb-5`}>
                  <p className="mb-0 fs-5 ">
                    Phil really made it feel like someone else was taking this
                    job search as seriously as I was.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default Reviews;
