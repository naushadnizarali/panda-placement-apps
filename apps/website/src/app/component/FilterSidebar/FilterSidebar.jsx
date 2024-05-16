import React, { useState } from 'react';
import Offcanvas from 'react-bootstrap/Offcanvas';
import styles from './FilterSidebar.module.css';
function OffCanvasExample({ width, name, children, icons }) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const toggleShow = () => setShow((s) => !s);

  return (
    <>
      <div className={styles.icons} onClick={toggleShow}>
        {icons}
      </div>
      <Offcanvas
        show={show}
        style={{
          width: width ? width : '',
        }}
        onHide={handleClose}
        placement="end"
        className={styles?.offcanvas}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title className="text-black">{name}</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body
          style={{
            height: '100%',
            padding: '0px',
          }}
        >
          {children}
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default OffCanvasExample;
