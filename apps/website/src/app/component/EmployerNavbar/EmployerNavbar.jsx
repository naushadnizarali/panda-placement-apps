import React from 'react';
import Logo from '../../../assets/LatestLogo.png';
import AccountMenu from '../employerProfileAvatar/employerProfileAvatar';
import style from './EmployerNavbar.module.css';

function EmployerNavbar() {
  return (
    <nav className={style.employernav}>
      <div>
        <img
          src={Logo}
          alt="logo here"
          style={{
            width: '100px',
            height: '75px',
            margin: '10px 0',
            objectFit: 'contain',
            mixBlendMode: 'multiply',
          }}
        />
      </div>
      <AccountMenu />
    </nav>
  );
}

export default EmployerNavbar;
