import { toBlob } from 'html-to-image';
import { useRef } from 'react';
import CustomButton from '../../component/Button/CustomButton';
import QRCode from 'react-qr-code';
import { HOSTED_IP } from '../../pages/Jsondata/URL';

const GenerateCode = ({ title }) => {
  const qrCodeRef = useRef(null);
  const downloadQRCode = () => {
    toBlob(qrCodeRef.current).then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${title}-qrcode.png`;
      link.click();
    });
  };
  return (
    <>
      <div
        style={{
          height: 'auto',
          margin: '0 auto',
          width: '150px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <QRCode
          ref={qrCodeRef}
          id="qrcode"
          size={256}
          style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
          value={`${HOSTED_IP}/job/${title}`}
          viewBox={`0 0 256 256`}
          level="L"
        />
        <CustomButton
          marginTop=".5rem"
          label="Download QR Code"
          onClick={downloadQRCode}
        />
      </div>
    </>
  );
};

export default GenerateCode;
