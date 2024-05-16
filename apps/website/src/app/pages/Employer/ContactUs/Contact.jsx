import React, { useEffect } from 'react';
import Contactus from '../../CommonPages/Contactus/Contactus';
import { DynamicTitle } from '../../../Helpers/DynamicTitle';

function Contact() {
  useEffect(() => {
    DynamicTitle('Contact-PandaPlacement');
  }, []);

  return (
    <div>
      <Contactus />
    </div>
  );
}

export default Contact;
