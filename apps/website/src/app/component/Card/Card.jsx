import React, { useState } from 'react';
import styles from './Card.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Not Chnage
import {
  faClockRotateLeft,
  faDollarSign,
  faLocationDot,
} from '@fortawesome/free-solid-svg-icons'; // Not Chnage
import { faCalendarDays } from '@fortawesome/free-regular-svg-icons'; // Not Chnage
import Modal from 'react-bootstrap/Modal';
import CustomButton from '../Button/CustomButton';
import Toast from '../Toast/Toast';
import { useNavigate } from 'react-router-dom';

function CandidateModal({ show, onHide, candidateData, token, isapplied }) {
  const navigate = useNavigate();

  const goTORegister = () => {
    navigate('/user/register');
    Toast.error('Register YourSelf!');
  };
  const goTOapplyjob = (e) => {
    navigate('/applyjob', { state: { data: candidateData } });
  };

  return (
    <Modal
      show={show}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      onHide={onHide}
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Job Details
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h2>{candidateData?.title}</h2>
        <h6>Hiring Country: {candidateData?.hiring_country}</h6>
        <h6>Hiring City: {candidateData?.hiring_city}</h6>
        <h6>Type : {candidateData?.type}</h6>
        <h6>
          Salary: {candidateData?.salary_start_range} USD-
          {candidateData?.salary_start_range} USD / {candidateData?.salary_rate}
        </h6>
        <h6>Application Deadline: {candidateData?.application_deadline}</h6>
        <h6>Description:</h6>
        <p>{candidateData?.description}</p>
      </Modal.Body>
      <Modal.Footer>
        <>
          {!isapplied ? (
            token ? (
              // Render Apply Now button with candidateData
              <CustomButton
                label="Apply Now"
                onClick={() => goTOapplyjob(candidateData)}
              />
            ) : (
              // Render Apply Now button that goes to registration if there's no token
              <CustomButton label="Apply Now" onClick={goTORegister} />
            )
          ) : // Render nothing if isapplied is false
          null}
        </>
      </Modal.Footer>
    </Modal>
  );
}

function Card({ data, isapplied }) {
  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const [modalShow, setModalShow] = useState(false);
  const [istoken, setistoken] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const totalPages = Math.ceil(data?.length / itemsPerPage);

  const generatePageNumbers = () => {
    const range = 2; // Number of page numbers to show on either side of the current page
    const pageNumbers = [];

    for (
      let i = Math.max(1, currentPage - range);
      i <= Math.min(totalPages, currentPage + range);
      i++
    ) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };
  const pageNumbers = generatePageNumbers();
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, data?.length);
  const currentData = data?.slice(startIndex, endIndex);

  const handleCandidateClick = (e) => {
    setSelectedCandidate(e);
    setModalShow(true);
    const token = localStorage.getItem('Usertoken');
    setistoken(token);
  };

  return (
    <>
      <div>
        <CandidateModal
          show={modalShow}
          onHide={() => setModalShow(false)}
          candidateData={selectedCandidate}
          token={istoken}
          isapplied={isapplied}
        />
        <div className="row row-cols-1 row-cols-md-2 g-4 ">
          {currentData.length === 0 ? (
            <h1
              // style={{ color: "white", textAlign: "center" }}
              className={styles.notfound}
            >
              No jobs Found
            </h1>
          ) : (
            currentData &&
            currentData?.map((e, i) => {
              return (
                <div className="col" key={i}>
                  <div className="card overflow-hidden">
                    <div className="card-body">
                      <div>
                        <div className="flex flex-wrap flex-row justify-between align-top ">
                          <h5 className="card-title">{e?.title}</h5>
                          <button
                            onClick={() => handleCandidateClick(e)}
                            className={styles.buttonclass}
                          >
                            View
                          </button>
                        </div>
                        <p className="card-title">{e.company_name}</p>
                      </div>
                      <div>
                        <div className="flex  flex-wrap flex-row justify-between">
                          <div className="flex flex-row items-center">
                            <FontAwesomeIcon icon={faLocationDot} />
                            <p className="ml-2 mt-3">
                              {e.hiring_city},{e.hiring_country}
                            </p>
                          </div>
                          <div className="flex flex-row items-center">
                            <FontAwesomeIcon icon={faClockRotateLeft} />
                            <p className="ml-2 mt-3 ">{e.type}</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap flex-row justify-between">
                          <div className="flex flex-row items-center">
                            <FontAwesomeIcon icon={faCalendarDays} />
                            <p className="ml-2 mt-3 ">
                              Apply Before-{e.application_deadline}
                            </p>
                          </div>
                          <div className="flex flex-row items-center">
                            <FontAwesomeIcon icon={faDollarSign} />
                            <p className="ml-2 mt-3 ">
                              {e.salary_start_range}-{e.salary_end_range}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
      {/* Pagination controls */}
      <div className="flex items-center justify-between border-gray-200 px-4 py-3 sm:px-6">
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-white">
              Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
              <span className="font-medium">{endIndex}</span> of{' '}
              <span className="font-medium">{data?.length}</span> results
            </p>
          </div>
          <div>
            <nav
              className="isolate inline-flex -space-x-px rounded-md shadow-sm"
              aria-label="Pagination"
            >
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-black ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                  currentPage === 1 ? 'cursor-not-allowed' : ''
                }`}
              >
                <span className="sr-only">Previous</span>
                Previous
              </button>
              {pageNumbers &&
                pageNumbers.map((pageNumber) => (
                  <button
                    key={pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                      currentPage === pageNumber
                        ? 'bg-white text-black'
                        : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                    }`}
                  >
                    {pageNumber}
                  </button>
                ))}
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-black ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                  currentPage === totalPages ? 'cursor-not-allowed' : ''
                }`}
              >
                <span className="sr-only">Next</span>
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}

export default Card;
