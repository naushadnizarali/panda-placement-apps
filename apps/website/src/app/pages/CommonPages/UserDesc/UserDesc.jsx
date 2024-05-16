import React, { useState } from 'react';
// import styles from "./PostNewJob.module.css";

import { Grid, TextField } from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from 'react-router-dom';
import Goback from '../../../component/GoBackicon/goback';
import { ResumeInput } from '../../../component/Input/TextInput';
import CustomButton from '../../../component/Button/CustomButton';
import axios from 'axios';
import { LOCAL_URL_USER } from '../../Jsondata/URL';

const UserDesc = () => {
  const [isloading, setIsloading] = useState(false);
  const navigate = useNavigate();
  const [dateValues, setDateValues] = useState({
    applicationDeadline: null,
  });
  const [data, setData] = useState([]);
  // const [image, setImage] = useState(null);
  const [jobDetails, setjobDetails] = useState({
    title: '',
    description: '',
    image: '',
  });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setjobDetails({
      ...jobDetails,
      [name]: value,
    });
  };
  const handleEditorChange = (value) => {
    setjobDetails({
      ...jobDetails,
      description: value,
    });
  };

  const handleDateChange = (date, field) => {
    const updatedDateValues = { ...dateValues };
    updatedDateValues[field] = date;
    setDateValues(updatedDateValues);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setjobDetails({ ...jobDetails, image: file });
  };

  const ShowAllInConsole = async () => {
    const formData = new FormData();

    const des = JSON.stringify({
      desc: jobDetails.description,
    });
    formData.append('title', jobDetails.title);
    formData.append('description', des);
    formData.append('image', jobDetails.image);
    try {
      const response = await axios.post(
        `${LOCAL_URL_USER}post_blogs/`,
        formData,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [
          { list: 'ordered' },
          { list: 'bullet' },
          { indent: '-1' },
          { indent: '+1' },
        ],
        ['link', 'image'],
        ['clean'],
      ],
    },
  };

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'link',
    'image',
  ];

  return (
    <>
      <>
        <div
          className="bg-white px-10 py-10 rounded"
          style={{ margin: '0px 20px' }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              marginBottom: '1rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
              }}
            >
              <Goback
                onClick={() => {
                  navigate('/employer/jobs');
                }}
              />
              <h2
                style={{
                  cursor: 'pointer',
                  marginTop: '.5rem',
                  marginLeft: '.5rem',
                }}
                className="fw-bold"
              >
                Post A New Blog
              </h2>
            </div>
          </div>
          {/* job Basic */}
          <div className="mr-md-4 flex items-left flex-col ">
            <div>
              <Grid item sx={12}>
                <ResumeInput
                  placeholder="Title"
                  name="title"
                  value={jobDetails.title}
                  onChange={handleInputChange}
                  required
                  borderradius={'0.25rem'}
                  padding={13}
                />
              </Grid>
              <Grid
                style={{
                  marginTop: '0.5rem',
                  width: '100%',
                }}
                item
                xs={12}
                md={8}
                lg={6}
              >
                <ReactQuill
                  modules={modules}
                  formats={formats}
                  theme="snow"
                  value={jobDetails.description}
                  name="description"
                  onChange={handleEditorChange}
                  style={{
                    height: '200px',
                    marginBottom: '1.5rem',
                    width: '100%',
                    borderradius: '0.25rem',
                  }}
                />
                {/* Additional content or components */}
              </Grid>
              <div style={{ marginTop: '4rem' }}>
                <div className="row">
                  <div className="col-md-6 mb-2">
                    <TextField
                      label="Select Image"
                      type="file"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '4rem' }}>
                <div className="row">
                  <div className="col-md-6 mb-2">
                    <CustomButton label="Console" onClick={ShowAllInConsole} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    </>
  );
};

export default UserDesc;
