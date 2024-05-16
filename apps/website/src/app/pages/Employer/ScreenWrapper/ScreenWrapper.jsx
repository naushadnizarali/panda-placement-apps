import React, { useEffect, useState } from 'react';
import './wrapper.css';
function ScreenWrapper({ children, sidebarOpen }) {
  const [contentClass, setContentClass] = useState(
    'content-small-sidebar-open',
  );

  useEffect(() => {
    const wideScreenMediaQuery = window.matchMedia('(min-width: 768px)');

    const handleScreenSizeChange = () => {
      if (wideScreenMediaQuery.matches && !sidebarOpen) {
        setContentClass('content-wide-sidebar-closed');
      } else {
        setContentClass('content-small-sidebar-open');
      }
    };
    handleScreenSizeChange(); // Set the initial class
    // Attach the screen size change handler
    window.addEventListener('resize', handleScreenSizeChange);

    // Remove the listener when the component is unmounted
    return () => {
      window.removeEventListener('resize', handleScreenSizeChange);
    };
  }, [sidebarOpen]);
  // f5f7fc
  return (
    <div className="bg-[var(--light-shade-grayish-blue)] mb-['-33px'] pb-['30']">
      {' '}
      <div className={contentClass}>{children}</div>
    </div>
  );
}

export default ScreenWrapper;
