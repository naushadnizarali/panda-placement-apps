import {
  FaEnvelope,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
} from 'react-icons/fa';
import { FaGoogle, FaPhoneVolume } from 'react-icons/fa6';

import { IoHomeSharp } from 'react-icons/io5';

import React from 'react';
import { Link } from 'react-router-dom';
import style from '../Footer/Footer.module.css';
import Toast from '../Toast/Toast';
import { RiInstagramFill } from 'react-icons/ri';

const Footer = () => {
  const trendingCategories = [
    'Information Technology',
    'Healthcare',
    'Finance',
    'Marketing',
    'Engineering',
    'Sales',
    'Customer Service',
  ];

  const trendingJobTypes = [
    'Full-time',
    'Part-time',
    'Contract',
    'Temporary',
    'Internship',
    'Freelance',
    'Remote',
  ];

  /* "text-center text-lg-start bg-body-tertiary text-muted */

  return (
    <footer className=" text-lg-start bg-body-tertiary text-muted pt-1">
      <section>
        <div className="container text-md-start mt-5">
          <div className="row mt-3">
            <div className="col-md-3 col-lg-4 col-xl-3 mx-auto mb-4">
              <h6 className="text-uppercase fw-bold mb-4">Pandaplacement</h6>
              <p>
                Discover opportunities and build your career with
                PandaPlacement. Explore our diverse job listings and find the
                perfect match for your skills and aspirations.
              </p>
              <div className={style.Box_1_iocn}>
                <a href="" className="me-4 text-reset">
                  <FaFacebook
                  // icon={faFacebook}
                  />
                </a>
                <a href="" className="me-4 text-reset">
                  <FaTwitter
                  // icon={faTwitter}
                  />
                </a>
                <a href="" className="me-4 text-reset">
                  <FaGoogle
                  // icon={faGoogle}
                  />
                </a>
                <a href="" className="me-4 text-reset">
                  <RiInstagramFill
                  // icon={faInstagram}
                  />
                </a>
                <a href="" className="me-4 text-reset">
                  <FaLinkedin
                  // icon={faLinkedin}
                  />
                </a>
              </div>
            </div>

            {/* Trending Categories */}
            <div className="col-md-2 col-lg-2 col-xl-2 mx-auto mb-4 ">
              <h6 className="text-uppercase fw-bold mb-4">
                Trending Categories
              </h6>
              <ul className="list-unstyled">
                {trendingCategories &&
                  trendingCategories?.map((category, index) => (
                    <li key={index}>
                      <Link
                        className={style.JobType_list}
                        // to={`/job/${category}`}
                        onClick={() => {
                          Toast.success('Coming Soon...');
                        }}
                      >
                        {category}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
            {/* Trending Job Types */}
            <div className="col-md-3 col-lg-2 col-xl-2 mx-auto mb-4">
              <h6 className="text-uppercase fw-bold mb-4">
                Trending JobTypes
              </h6>
              <ul className="list-unstyled">
                {trendingJobTypes &&
                  trendingJobTypes.map((JobType, index) => (
                    <li key={index}>
                      <Link
                        className={style.JobType_list}
                        // to={`/job/${type}`}
                        onClick={() => {
                          Toast.success('Coming Soon...');
                        }}
                      >
                        {JobType}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>

            <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mb-md-0 mb-4">
              <h6 className="text-uppercase fw-bold mb-4">Contact</h6>
              <div className="d-flex ">
                {/* <IoHomeSharp className={style.HomeIcon}
                    style={{ fontSize: "30px"}}
                  /> */}
                <p className="mb-1 ms-1">
                  {/* 215/3, Bungalow #2, Punjatan Society Karachi, Pakistan */}
                </p>
              </div>
              {/* <p className="mb-1 d-flex">
                  <FaEnvelopeOpenText
                  // icon={faEnvelope}
                  /> info@Pandaplacement.com
                </p> */}
              {/* <p className="mb-1 d-flex ">
                  <FaPhone
                  // icon={faPhone}
                  /> + 01 234 567 88
                  </p>
                  <p className="mb-1 d-flex">
                  <FaPhone
                  // icon={faPhone}
                  /> + 01 234 567 89
                </p> */}
              <div className="d-flex  mb-1">
                <FaEnvelope />
                <p className="ms-1 mb-0">info@Pandaplacement.com</p>
              </div>
              <div className="d-flex  mb-1">
                <FaPhoneVolume />
                <p className="ms-1 mb-0">+ 1 234 567 88</p>
              </div>
              <div className="d-flex  mb-1">
                <FaPhoneVolume />
                <p className="ms-1 mb-0">+ 1 234 567 89</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <hr className="mx-4" />
      <div className={style.footer_bottom}>
        <div>Designed By : KajDevelopers</div>
        <div>About Pandaplacement Privacy Policy Disclaimer</div>
      </div>
    </footer>
  );
};

export default Footer;
