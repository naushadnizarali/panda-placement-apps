import React, { useState } from 'react';
import styles from './ProfileEdit.module.css';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { ResumeInput } from '../Input/TextInput';
import CustomButton from '../Button/CustomButton';

function ProfileEdit({
  title,
  details,
  onClick,
  item,
  isCommaSeparated,
  value,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedDetails, setEditedDetails] = useState(details);

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (event) => {
    setEditedDetails(event.target.value);
  };

  const handleSaveClick = () => {
    setIsEditing(false);
    onClick(editedDetails); // Call the onClick callback with the edited details
    // console.log(editedDetails);
    //
  };
  const handleDeleteClick = (e) => {
    // console.log(e);
  };
  // C:\Users\ahsan\Desktop\New folder (2)\pandaplacementFrontEnd\src\component\ProfileEdit\ProfileEdit.js
  return (
    <div>
      <div className="flex flex-row flex-wrap items-center justify-between">
        <h5 className={styles.edit}>{title}</h5>
        <FaEdit
          // icon={faEdit}
          color="black"
          onClick={handleEditClick}
          style={{ cursor: 'pointer' }}
        />
      </div>
      <div>
        {isEditing ? (
          <div>
            {isCommaSeparated ? (
              <ResumeInput
                type="text"
                value={editedDetails}
                onChange={handleInputChange}
              />
            ) : (
              <textarea
                rows="5"
                value={editedDetails}
                onChange={handleInputChange}
                style={{
                  width: '100%', // Set the width to 100% to make it responsive
                  maxWidth: '100%', // Limit the maximum width to 100% for very large screens
                }}
              />
            )}
            <CustomButton
              marginTop={5}
              onClick={handleSaveClick}
              label="Save"
            />
          </div>
        ) : (
          <p>
            {editedDetails ? (
              isCommaSeparated ? (
                <ul
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    flexWrap: 'wrap',
                  }}
                >
                  {editedDetails &&
                    editedDetails.split(',').map((skill, index) => (
                      <>
                        <p
                          style={{
                            backgroundColor: 'lightblue',
                            margin: '1rem',
                            paddingLeft: '1rem',
                            paddingRight: '1rem',
                          }}
                          key={index}
                        >
                          {skill.trim()}
                        </p>
                        <div className="flex flex-wrap items-center">
                          <FaEdit
                            // icon={faEdit}
                            color="black"
                            onClick={handleEditClick}
                            style={{ cursor: 'pointer', marginRight: '10px' }}
                          />
                          <FaTrashAlt
                            // icon={faTrash}
                            color="black"
                            onClick={() => handleDeleteClick(skill)}
                            style={{ cursor: 'pointer' }}
                          />
                        </div>
                      </>
                    ))}
                </ul>
              ) : (
                <div>
                  <p style={{ width: '100%', overflow: 'hidden' }}>
                    {editedDetails}
                  </p>
                </div>
              )
            ) : (
              <p>`No ${item} have been added!`</p>
            )}
            {editedDetails &&
              isCommaSeparated &&
              editedDetails.split(',').length === 0 && (
                <p>No {item} have been added!</p>
              )}
          </p>
        )}
      </div>
    </div>
  );
}

export default ProfileEdit;
