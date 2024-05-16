import React, { useEffect, useState } from 'react';
import styles from '../CVTemplates/CVTemplates.module.css';
import { FaEye } from 'react-icons/fa';
import { FaCheckDouble } from 'react-icons/fa6';
import { FaChevronLeft } from 'react-icons/fa6';
import { FaChevronRight } from 'react-icons/fa6';
import { FaTimes } from 'react-icons/fa';

const CVTemplates = ({ closeTemplateModel, updateTemplateID, cvTemplates }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [cvTemplates, setcvTemplates] = useState(null);
  // const userapi = UserApi();

  // const getAllTemplates = async () => {
  //   try {
  //     const response = await userapi.getCvTemplate();
  //     setcvTemplates(response);
  //     console.log("=================================",response)
  //   } catch (error) {
  //     console.log("ERROR:In Fetching Cv Templates", error);
  //   }
  // };

  // useEffect(() => {
  //   getAllTemplates();
  // }, []);

  // const cvTemplates = [
  //   {
  //     id: 1,
  //     img: cv1,
  //   },
  //   {
  //     id: 2,
  //     img: cv2,
  //   },
  // ];

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % cvTemplates.length);
  };

  const prevImage = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + cvTemplates.length) % cvTemplates.length,
    );
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openModal = (index) => {
    setCurrentIndex(index);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className={styles.modal}>
        <div
          className={
            cvTemplates.length < 4
              ? styles.modalContentGridforLessthen_5
              : styles.modalContentGrid
          }
        >
          {cvTemplates &&
            cvTemplates.map((template, index) => (
              <>
                <button
                  className={styles.first_closeButton}
                  onClick={closeTemplateModel}
                >
                  <FaTimes
                  // icon={faTimes}
                  />
                </button>
                <div
                  key={template.temID}
                  className={styles.templateInModalGrid}
                >
                  <img
                    src={template.image}
                    alt={`CV Template ${template.temID}`}
                    className={styles.templateImage}
                    onClick={() => openModal(index)}
                  />
                  <div className={styles.templateButtons}>
                    <button
                      className={styles.Btn}
                      onClick={() => openModal(index)}
                    >
                      <div className={styles.sign}>
                        <FaEye
                        // icon={faEye}
                        />
                        <div className={styles.text}>View</div>
                      </div>
                    </button>
                    <button
                      className={styles.Btn}
                      onClick={() => {
                        updateTemplateID(template.temID, template.image);
                        closeTemplateModel();
                      }}
                    >
                      <div className={styles.sign}>
                        <FaCheckDouble
                        // icon={faCheckDouble}
                        />
                        <div className={styles.text}>Select Template</div>
                      </div>
                    </button>
                  </div>
                </div>
              </>
            ))}
        </div>
      </div>

      {isModalOpen && (
        <div className={styles.modal}>
          <button onClick={prevImage} className={styles.navButton}>
            <FaChevronLeft
            // icon={faChevronLeft}
            />
          </button>
          <div className={styles.modalContent}>
            <img
              src={cvTemplates[currentIndex].image}
              alt={`CV Template ${cvTemplates[currentIndex].temID}`}
              className={styles.modalImage}
            />
            <button onClick={closeModal} className={styles.closeButton}>
              <FaTimes
              // icon={faTimes}
              />
            </button>
          </div>
          <button onClick={nextImage} className={styles.navButton}>
            <FaChevronRight
            // icon={faChevronRight}
            />
          </button>
          <button
            className={styles.Iner_Btn}
            onClick={() => {
              closeModal();
              closeTemplateModel();
              updateTemplateID(
                cvTemplates[currentIndex].temID,
                cvTemplates[currentIndex].image,
              );
            }}
          >
            <div className={styles.sign_12}>
              <FaCheckDouble
              // icon={faCheckDouble}
              />
              <div className={styles.text2}>Select Template</div>
            </div>
          </button>
        </div>
      )}
    </>
  );
};

export default CVTemplates;
