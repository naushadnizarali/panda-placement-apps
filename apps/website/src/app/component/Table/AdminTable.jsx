import React, { useState } from 'react';
import styles from './Table.module.css';
import { BiDotsVerticalRounded } from 'react-icons/bi';
import { ResumeSelect } from '../Input/TextInput';
import { Avatar } from '@mui/material';
import { LOCAL_PDF_EMPLOYER } from '../../pages/Jsondata/URL';
import Toast from '../Toast/Toast';
import { Button } from 'bootstrap';
import axios from 'axios';
import CandidateCard from '../../component/Candidate/CandidateCard';
import CustomSpinner from '../Spinner/Spinner';
import { FaEye } from 'react-icons/fa6';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
function AdminTable({
  isjobs,
  loading,
  isPendingJob,
  data,
  columns,
  onRowClick,
  onStatusChange,
  option,
  onEdit,
  onDelete,
  onView,
  isseeker,
}) {
  const handleRowClick = (item) => {
    if (onRowClick) {
      onRowClick(item);
    }
  };

  const handleStatusChange = (event, item) => {
    if (onStatusChange) {
      onStatusChange(event.target.value, item);
    }
  };

  const [showDropdown, setShowDropdown] = useState(false);

  const handleDropdownToggle = () => {
    setShowDropdown(!showDropdown);
  };

  const formatDateTime = (dateString) => {
    const currentDate = new Date();
    const inputDate = new Date(dateString);

    const timeDifferenceInMinutes = Math.floor(
      (currentDate - inputDate) / (1000 * 60),
    );

    if (timeDifferenceInMinutes <= 60) {
      // If the time is within the last hour, display the time in minutes
      return `${timeDifferenceInMinutes}m ago`;
    } else if (timeDifferenceInMinutes <= 24 * 60) {
      // If the time is within the last 24 hours, display the time in hours
      const hours = Math.floor(timeDifferenceInMinutes / 60);
      return `${hours}h ago`;
    } else {
      // If the time is more than 24 hours ago, display the date in MMM/DD/YY format
      const options = { month: 'short', day: '2-digit', year: '2-digit' };
      return inputDate.toLocaleDateString(undefined, options);
    }
  };

  return (
    <div
      className={
        isjobs
          ? styles.tablecontainerFullHeight
          : styles.tablecontainerhalfHeight
      }
    >
      <table>
        <thead className={styles.theadfixed}>
          <tr>
            {columns &&
              columns?.map((column, index) => (
                <th key={index} className={styles.tablecell}>
                  {column}
                </th>
              ))}
            <th className={styles.tablecell}>Actions</th>
            {/*  <th className={styles.tablecell}>Job Status</th> */}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="6">
                <div className={styles.loadder}>
                  <CustomSpinner />
                </div>
              </td>
            </tr>
          ) : data?.length === 0 ? (
            <tr>
              <td colSpan="6">
                <p className={styles.loadder}>Data Not Found!</p>
              </td>
            </tr>
          ) : (
            <>
              {/* NOTE:Rendering the Multiple Tabels Bodies On the base of props  */}
              {/* NOTE:isPendingJob For Showing Jobs on Dashboard and AllJObs    */}
              {isPendingJob &&
                data &&
                data?.map((item, index) => (
                  <tr key={item.id} className={styles.tablerow}>
                    <td
                      style={{ cursor: 'pointer ' }}
                      onClick={() => handleRowClick(item)}
                      className={styles.tablecell}
                    >
                      {index + 1}
                    </td>
                    <td
                      style={{ cursor: 'pointer ' }}
                      onClick={() => handleRowClick(item)}
                      className={styles.tablecell}
                    >
                      {item?.title}
                    </td>
                    <td className={styles.tablecell}>
                      {item?.employer?.email}
                    </td>
                    <td className={styles.tablecell}>{item?.hiring_city}</td>
                    <td className={styles.tablecell}>
                      <div className="flex items-center">
                        <ResumeSelect
                          filterelement
                          title={item?.status}
                          options={option}
                          onChange={(event) => handleStatusChange(event, item)}
                        />
                      </div>
                    </td>
                    <td className={styles.tablecell}>
                      <div className="dropdown">
                        <a
                          className="text-black"
                          href="#"
                          role="button"
                          id="dropdownMenuLink"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <BiDotsVerticalRounded
                            className={styles.iconoptions}
                          />
                        </a>
                        <ul
                          className="dropdown-menu"
                          aria-labelledby="dropdownMenuLink"
                        >
                          <li>
                            <a
                              onClick={() => {
                                onView(item);
                              }}
                              className={`${styles.dropbtn} `}
                            >
                              <span>View </span>
                              <div className={styles.icons}>
                                <FaEye
                                  style={{ display: 'inline-flex' }}
                                  // icon={faEye}
                                />
                              </div>
                            </a>
                          </li>
                          <li>
                            <a
                              onClick={() => {
                                onEdit(item);
                              }}
                              className={`${styles.dropbtn} `}
                            >
                              <span>Edit </span>
                              <div className={styles.icons_edit}>
                                <FaEdit
                                  style={{ display: 'inline-flex' }}
                                  // icon={faPenToSquare}
                                />
                              </div>
                            </a>
                          </li>
                          <li>
                            <a
                              onClick={() => {
                                onDelete(item);
                              }}
                              className={`${styles.dropbtn} `}
                            >
                              <span>Delete </span>
                              <div className={styles.icons_delete}>
                                <FaTrashAlt
                                  style={{ display: 'inline-flex' }}
                                  // icon={faTrashCan}
                                />
                              </div>
                            </a>
                          </li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                ))}

              {/* NOTE:isseeker For Showing Seekers on Seekrs OPtion    */}
              {isseeker &&
                data &&
                data?.map((item, index) => (
                  <tr key={item.id} className={styles.tablerow}>
                    <td
                      style={{ cursor: 'pointer ' }}
                      onClick={() => handleRowClick(item)}
                      className={styles.tablecell}
                    >
                      {index + 1}
                    </td>
                    <td
                      style={{ cursor: 'pointer ' }}
                      onClick={() => handleRowClick(item)}
                      className={styles.tablecell}
                    >
                      {item?.first_name ? item?.first_name : 'No Data'}
                    </td>
                    <td className={styles.tablecell}>
                      {item?.last_name ? item?.last_name : 'No Data'}
                    </td>
                    <td className={styles.tablecell}>
                      {item?.email ? item?.email : 'No Data'}
                    </td>
                    <td className={styles.tablecell}>
                      {item?.phone ? item?.phone : 'No Data'}
                    </td>
                    <td className={styles.tablecell}>
                      <div className="flex items-center">
                        <ResumeSelect
                          filterelement
                          title={item?.status}
                          options={option}
                          onChange={(event) => handleStatusChange(event, item)}
                        />
                      </div>
                    </td>
                    {/* //Table Actions   */}
                    <td className={styles.tablecell}>
                      <div className="dropdown">
                        <a
                          className="text-black"
                          href="#"
                          role="button"
                          id="dropdownMenuLink"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <BiDotsVerticalRounded
                            className={styles.iconoptions}
                          />
                        </a>
                        <ul
                          className="dropdown-menu"
                          aria-labelledby="dropdownMenuLink"
                        >
                          <li>
                            <a
                              onClick={() => {
                                onView(item);
                              }}
                              className={`${styles.dropbtn} `}
                            >
                              <span>View </span>
                              <div className={styles.icons}>
                                <FaEye
                                  style={{ display: 'inline-flex' }}
                                  //  icon={faEye}
                                />
                              </div>
                            </a>
                          </li>
                          <li>
                            <a
                              onClick={() => {
                                onEdit(item);
                              }}
                              className={`${styles.dropbtn} `}
                            >
                              <span>Edit </span>
                              <div className={styles.icons_edit}>
                                <FaEdit
                                  style={{ display: 'inline-flex' }}
                                  // icon={faPenToSquare}
                                />
                              </div>
                            </a>
                          </li>
                          <li>
                            <a
                              onClick={() => {
                                onDelete(item);
                              }}
                              className={`${styles.dropbtn} `}
                            >
                              <span>Delete </span>
                              <div className={styles.icons_delete}>
                                <FaTrashAlt
                                  style={{ display: 'inline-flex' }}
                                  // icon={faTrashCan}
                                />
                              </div>
                            </a>
                          </li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                ))}
            </>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AdminTable;
