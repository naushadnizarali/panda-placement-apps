import React, { useState, useEffect } from 'react';
import styles from './ImageUploader.module.css';
import Toast from '../Toast/Toast';
import { Avatar } from '@mui/material';
import { FaUpload } from 'react-icons/fa6';
import { useDispatch } from 'react-redux';
import { removeDataProperty } from '../../../redux/slice/userdataSlice';
import { removeEmployerDataProperty } from '../../../redux/slice/employerProfileDataSlice';

function ImageUploader({
  isEmployerProfile,
  profileImage,
  onFileChange,
  clearProfileImage,
  isUserProfile,
}) {
  const [image, setImage] = useState(null);
  const [showInput, setShowInput] = useState(true);
  const [selectimage, setselectimage] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    // Check if profileImage is not null before updating the state
    if (profileImage) {
      setImage(profileImage);
      setShowInput(false); // Update showInput when there is an image
    }
  }, [profileImage]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 2 * 1024 * 1024) {
      const imageUrl = URL.createObjectURL(file);
      setselectimage(imageUrl);
      onFileChange(file);
    } else {
      Toast.error('File should not exceed 2MB');
    }
  };

  const resetImage = () => {
    setImage(null);
    setselectimage(null);
    setShowInput(true);
    clearProfileImage();
    if (isEmployerProfile) {
      dispatch(removeEmployerDataProperty('image'));
    } else if (isUserProfile) {
      dispatch(removeDataProperty('image'));
    }
  };

  return (
    <div style={{ overflow: 'hidden' }}>
      {showInput ? (
        <div className={styles['uploadButton']}>
          <input
            className={styles.uploadButtonInput}
            accept=".jpeg, .png, .jpg"
            id="upload"
            required
            type="file"
            name="attachments[]"
            onChange={handleImageChange}
          />

          <label className={styles.uploadButtonButton} htmlFor="upload">
            {image || selectimage ? (
              <img
                src={selectimage ? selectimage : image}
                alt="Uploaded image"
                style={{ maxWidth: '100%', maxHeight: '100%' }}
              />
            ) : (
              'Browse image'
            )}
          </label>
          <span className={styles['uploadButton-file-name']}></span>
        </div>
      ) : (
        <>
          <div>
            <Avatar
              sx={{ height: 130, width: 130 }}
              alt="Avatar"
              src={selectimage ? selectimage : image}
            />
          </div>
          <div></div>
          <FaUpload
            onClick={resetImage}
            // icon={faUpload}
          />
        </>
      )}
    </div>
  );
}

export default ImageUploader;
