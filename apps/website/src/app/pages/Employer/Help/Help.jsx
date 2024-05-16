import React, { useEffect } from 'react';
import HelpCards from '../../../component/Card/HelpCards';
import { DynamicTitle } from '../../../Helpers/DynamicTitle';

function Help() {
  useEffect(() => {
    DynamicTitle('Help-PandaPlacement');
  }, []);

  return (
    <div style={{ height: '100vh' }}>
      <HelpCards />
    </div>
  );
}

export default Help;
