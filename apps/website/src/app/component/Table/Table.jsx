import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { BiDotsVerticalRounded } from 'react-icons/bi';
import { ResumeSelect } from '../Input/TextInput';
import { FaEye } from 'react-icons/fa6';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import Toast from '../Toast/Toast';
import { Button } from 'bootstrap';
import axios from 'axios';
import CandidateCard from '../../component/Candidate/CandidateCard';
import CustomSpinner from '../Spinner/Spinner';
import { Avatar, Checkbox } from '@mui/material';
import TablePagination from '@mui/material/TablePagination';
import EmployerAPIS from '../../Apis/EmployerApi';
import { LOCAL_PDF_EMPLOYER } from '../../pages/Jsondata/URL';
import CustomButton from '../Button/CustomButton';
import { FaFileDownload } from 'react-icons/fa';
import styles from './Table.module.css';
function Table({
  isjobs,
  data,
  columns,
  onRowClick,
  onStatusChange,
  Applicantdetails,
  actionsoptins,
  Applicantcolums,
  option,
  jobStatus,
  onEdit,
  onDelete,
  onView,
  openEdit,
  openDelete,
  openView,
  onSelectionChange,
  showactions,
  onBulkDownload,
  setSelectedData,
}) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selected, setselected] = useState([]); //[] There  are Mulitple selected rows
  const [spin, setSpin] = useState([]);
  const [page, setPage] = useState(0); // Updated state for page
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isloading, setLoading] = useState(false);
  const employerapi = EmployerAPIS();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSelectAllClick = (event) => {
    let newSelected;
    if (event.target.checked) {
      newSelected = data.map((item) => item.id);

      setselected(newSelected);
    } else {
      setselected([]);
    }
    if (onSelectionChange) {
      onSelectionChange(newSelected);
    }
  };

  const handleCheckBoxClick = (e, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected?.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected?.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected?.slice(0, selectedIndex),
        selected?.slice(selectedIndex + 1),
      );
    }
    setselected(newSelected);
    if (onSelectionChange) {
      onSelectionChange(newSelected);
    }
  };

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

  // Function to download resume
  const handleDownload = async (id) => {
    // const applicationResponse = await employerapi?.DownloadCV([id]);
    // return;
    // const blob = new Blob([applicationResponse], { type: 'application/pdf' });
    // const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = `https://pandaplacement.com/api/employer/downloadresumes?ids=${id},`;
    // link.setAttribute('download', 'file.pdf'); //or any other extension
    // document.body.appendChild(link);
    link.click();
    // document.body.removeChild(link);
    // URL.revokeObjectURL(href);
  };
  // const handleDownload = async (e, id) => {
  //   setLoading(true);
  //   setTimeout(() => {
  //     setLoading(false);
  //   }, 1000);
  // };

  return (
    <>
      <div className={styles.tablecontainer}>
        <table>
          <thead>
            <tr className={styles.tablerow}>
              <th>
                <Checkbox
                  color="primary"
                  indeterminate={selected.length > 0}
                  checked={selected.length === data.length}
                  onChange={handleSelectAllClick}
                />
              </th>
              {columns &&
                columns.map((column, index) => (
                  <th key={index} className={styles.tablecell}>
                    {column}
                  </th>
                ))}
              {isjobs ? (
                <th className={styles.tablecell}>Actions</th>
              ) : (
                <>
                  <th className={styles.tablecell}>Job Status</th>
                  <th className={styles.tablecell}>Actions</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {isjobs ? (
              data.length === 0 ? (
                <tr>
                  <td>
                    <h5>Applications Not Found!</h5>
                  </td>
                </tr>
              ) : (
                data &&
                data
                  ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  ?.map((item, i) => (
                    <tr key={i} className={styles.tablerow}>
                      <td style={{ cursor: 'pointer ' }}>
                        <Checkbox
                          checked={selected.indexOf(item.id) !== -1}
                          onChange={(event) =>
                            handleCheckBoxClick(event, item.id)
                          }
                          color="primary"
                        />
                      </td>
                      <td
                        style={{ cursor: 'pointer ' }}
                        onClick={() => handleRowClick(item)}
                        className={styles.tablecell}
                      >
                        <Avatar
                          alt={item?.seeker_name}
                          src={`${LOCAL_PDF_EMPLOYER}${item?.user?.image}`}
                          sx={{ width: 56, height: 56 }}
                        />
                      </td>
                      <td
                        style={{ cursor: 'pointer ' }}
                        onClick={() => handleRowClick(item)}
                        className={styles.tablecell}
                      >
                        {item?.seeker_name ? item?.seeker_name : 'Not Found'}
                      </td>
                      <td className={styles.tablecell}>
                        {item?.user?.phone ? item?.user?.phone : 'Not Found'}
                      </td>
                      <td className={styles.tablecell}>
                        {item?.user?.email ? item?.user?.email : 'Not Found'}
                      </td>
                      <td className={styles.tablecell}>
                        {item?.employement?.experience
                          ? item?.employement?.experience
                          : 'Not Found'}
                      </td>
                      <td className={styles.tablecell}>
                        {/* <div style={{ width: "10rem", display: "flex", justifyContent: 'center' }}>
                          <CustomButton
                            onClick={() => handleDownload(item.id)}
                            label={<FaFileDownload />}
                            // label={loading ? <CustomSpinner/> : <FaFileDownload /> }
                          />

                        </div> */}
                        {isloading ? (
                          <CustomSpinner />
                        ) : (
                          <div
                            style={{
                              width: '10rem',
                              display: 'flex',
                              justifyContent: 'center',
                            }}
                          >
                            <CustomButton
                              onClick={() => handleDownload(item.id)}
                              label={<FaFileDownload />}
                            />
                          </div>
                        )}
                      </td>
                      <td className={styles.tablecell}>
                        <div style={{ width: '8rem' }}>
                          <ResumeSelect
                            isStatus
                            title={item.status}
                            options={actionsoptins}
                            disabled={
                              item?.status === 'Shortlist' ||
                              item?.status === 'Reject'
                            }
                            onChange={(event) =>
                              handleStatusChange(event, item)
                            }
                          />
                        </div>
                      </td>
                      <td>
                        <div className="dropdown">
                          <a
                            className="btn"
                            href="#"
                            role="button"
                            id="dropdownMenuLink"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            {/* <BiDotsVerticalRounded
                              className={styles.iconoptions}
                            /> */}
                          </a>
                          {/* <ul
                            className="dropdown-menu"
                            aria-labelledby="dropdownMenuLink"
                          >
                            <li className="dropdown-item">
                              <a
                                onClick={() => {
                                  openDelete(item);
                                }}
                                className={`${styles.dropbtn} `}
                                href="#"
                              >
                                <span>Delete </span>
                                <div className={styles.icons_delete}>
                                  {" "}
                                  <FaTrashAlt
                                    style={{ display: "inline-flex" }}
                                    // icon={faTrashCan}
                                  />
                                </div>
                              </a>
                            </li>
                          </ul> */}
                        </div>
                      </td>
                    </tr>
                  ))
              )
            ) : (
              data &&
              data
                ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                ?.map((item) => (
                  <tr key={item.id} className={styles.tablerow}>
                    <td style={{ cursor: 'pointer ' }}>
                      <Checkbox
                        checked={selected.indexOf(item.id) !== -1}
                        onChange={(event) =>
                          handleCheckBoxClick(event, item.id)
                        }
                        color="primary"
                      />
                    </td>
                    <td
                      style={{ cursor: 'pointer ' }}
                      onClick={() => handleRowClick(item)}
                      className={styles.tablecell}
                    >
                      {item.title}
                    </td>
                    <td className={styles.tablecell}>{item.status}</td>
                    <td className={styles.tablecell}>
                      {item.applicationCount}
                    </td>
                    <td className={styles.tablecell}>{item.viewcount}</td>
                    <td className={styles.tablecell}>
                      {formatDateTime(item.created_at)}
                    </td>
                    <td className={styles.tablecell}>
                      <div
                        className="flex items-center "
                        style={{ width: '8rem' }}
                      >
                        <ResumeSelect
                          isStatus
                          filterelement
                          title={item?.phase}
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
                ))
            )}
          </tbody>
        </table>
      </div>
      <div
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'end' }}
      >
        <TablePagination
          rowsPerPageOptions={[10, 15, 20, 30, 40, 50]}
          count={data?.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>
    </>
  );
}

export default Table;
