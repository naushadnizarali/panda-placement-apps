import React from 'react';
import Navbar from '../component/Navbar/Navbar';

function Layout({ children }) {
  return (
    <div>
      <Navbar userid={true} />
      <div className="content">{children}</div>
    </div>
  );
}

export default Layout;
