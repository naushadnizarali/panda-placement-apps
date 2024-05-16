import React from 'react';
import { ResumeInput } from '../Input/TextInput';
import styles from './Search.module.css';
import CustomButton from '../Button/CustomButton';
import Toast from '../Toast/Toast';
const SearchInput = ({
  skills,
  setSkills,
  currentSkill,
  setCurrentSkill,
  currentLevel,
  setCurrentLevel,
  levels,
  placeholder,
  inputType,
}) => {
  const handleSkillChange = (event) => {
    setCurrentSkill(event.target.value);
  };

  const handleLevelChange = (event) => {
    setCurrentLevel(event.target.value);
  };

  const handleAddSkill = () => {
    if (currentSkill?.trim() !== '' && currentLevel?.trim() !== '') {
      const skillToAdd = { skill: currentSkill, level: currentLevel };
      setSkills([...skills, skillToAdd]);
      setCurrentSkill('');
      setCurrentLevel('');
    } else {
      Toast.error('select a level fot ' + inputType);
    }
  };

  return (
    <div>
      <div className={styles.Inputwrapper}>
        <ResumeInput
          width="50%"
          type="text"
          value={currentSkill}
          onChange={handleSkillChange}
          placeholder={placeholder}
        />
        <select
          className={styles.selectstyles}
          value={currentLevel}
          onChange={handleLevelChange}
        >
          <option value="">Select Level</option>
          {levels.map((level, index) => (
            <option key={index} value={level}>
              {level}
            </option>
          ))}
        </select>
        <CustomButton label="Add" onClick={handleAddSkill} />
      </div>
    </div>
  );
};

export default SearchInput;
