import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import UserApi from '../../Apis/UserApi';
import styles from './NotifyNodal.module.css';
import logo from '../../../assets/LatestLogo.png';
import { useDispatch } from 'react-redux';
import { setCountryData } from '../../../redux/slice/SelectedCountrySlice';
import { useNavigate } from 'react-router-dom';
import { Fade } from 'react-reveal';

function Example() {
  const userApi = UserApi();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [countriesData, setCountriesData] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  const handleClose = () => {
    setShow(false);
    if (selectedCountry) {
      navigate('/findjobs');
      setSelectedCountry(null);
    } else {
      setShow(false);
    }
  };

  const handleShow = async () => {
    setShow(true);
    try {
      const response = await userApi?.getCountries();
      setCountriesData(response);
    } catch (error) {
      console.error('ERROR: Internal Server Error', error);
    }
  };

  const handleSearch = (e) => {
    setSearchValue(e.target.value);
  };

  const handleCountyClick = (country) => {
    setSelectedCountry(country.name);
    setSearchValue(country.name);
    dispatch(setCountryData(country.name));
  };

  const filteredCountries = countriesData.filter((country) =>
    country.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  useEffect(() => {
    setTimeout(() => {
      const hasModalShown = localStorage.getItem('hasModalShown');
      if (!hasModalShown) {
        handleShow();
        localStorage.setItem('hasModalShown', 'true');
      }
    }, 3000);
  }, []);

  return (
    <>
      {/* <button onClick={() => { handleShow() }}>open modal</button> */}
      <Fade top>
        <Modal
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={show}
          onHide={handleClose}
          className={styles.mainModal}
        >
          <Modal.Body style={{ padding: '5px 13px' }}>
            <div
              style={{
                textAlign: 'center',
                margin: '5px',
              }}
            >
              <img
                src={logo}
                style={{
                  width: '19%',
                  margin: '0 auto',
                }}
              ></img>
              {/* <h5>Welcome to PandaPlacement!</h5> */}
              <p
                style={{
                  fontSize: 15,
                  lineHeight: '0.99',
                  padding: '20px',
                }}
              >
                We want to provide you with the best job opportunities. To
                tailor our suggestions based on your Country.
              </p>
            </div>
            {/* <Modal.Title style={{}}>Select Country</Modal.Title> */}
            <div>
              <input
                type="text"
                value={searchValue}
                onChange={handleSearch}
                placeholder="Search country..."
                style={{
                  // border: 'none',
                  borderRadius: '3px',
                  backgroundColor: 'transparent',
                  width: '100%',
                  outline: 'none',
                }}
              />
              <ul style={{}} className={styles.ModalUl}>
                {filteredCountries.map((country, index) => (
                  <li
                    className={styles.countryItem}
                    key={index}
                    onClick={() => handleCountyClick(country)}
                  >
                    {country.name}
                  </li>
                ))}
              </ul>
            </div>
            <Modal.Footer style={{ padding: '10px' }}>
              <Button
                className={styles.modalButtonsOulined}
                onClick={handleClose}
              >
                Skip
              </Button>
              <Button className={styles.modalButtons} onClick={handleClose}>
                Save
              </Button>
            </Modal.Footer>
          </Modal.Body>
        </Modal>
      </Fade>
    </>
  );
}

export default Example;

{
  /* <Modal.Header closeButton style={{ padding: '10px' }}>
                    <img src={logo} style={{
                        width: " 70px"

                    }}></img>
                </Modal.Header> */
}
