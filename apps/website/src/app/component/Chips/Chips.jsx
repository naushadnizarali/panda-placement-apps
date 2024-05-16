import React from 'react';
import styles from './Chips.module.css';

const Chips = () => {
  const skills = [{ skill: 'HTML', level: 'Advanced' }];

  return (
    <div>
      <div>
        {skills.map((skill, index) => (
          <div key={index}>
            <span>
              {skill.skill} - {skill.level}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Chips;
