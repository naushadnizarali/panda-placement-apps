import React, { useEffect, useState } from 'react';
import './HireExpert.css';
import { DynamicTitle } from '../../Helpers/DynamicTitle';

function HireExpert() {
  const [isAnnually, setIsAnnually] = useState(false);

  const togglePricing = () => {
    setIsAnnually(!isAnnually);
  };

  useEffect(() => {
    DynamicTitle('HireExpert-PandaPlacement');
  }, []);

  return (
    <div className="container">
      <header>
        <h1 className="OurPricing">Our Pricing for expert</h1>
        <div className="toggle">
          <label>Annually </label>
          <div className="toggle-btn">
            <input
              type="checkbox"
              className="checkbox"
              id="checkbox"
              checked={isAnnually}
              onChange={togglePricing}
            />
            <label className="sub" htmlFor="checkbox">
              <div className="circle"></div>
            </label>
          </div>
          <label> Monthly</label>
        </div>
      </header>
      <div className="cards">
        <div className="card ">
          <ul className="pricing-list">
            <li className="pack">Startup</li>
            <li id="basic" className="price bottom-bar">
              {isAnnually ? '$199.99' : '$19.99'}
            </li>
            <li className="bottom-bar">500 GB Storage</li>
            <li className="bottom-bar">2 Users Allowed</li>
            <li className="bottom-bar">Send up to 3 GB</li>
            <li>
              <button className="selecBtn">SELECT</button>
            </li>
          </ul>
        </div>
        <div className={`card  ${isAnnually ? 'active' : ''}`}>
          <ul className="pricing-list">
            <li className="pack">Professional</li>
            <li id="professional" className="price bottom-bar">
              {isAnnually ? '$249.99' : '$24.99'}
            </li>
            <li className="bottom-bar">1 TB Storage</li>
            <li className="bottom-bar">5 Users Allowed</li>
            <li className="bottom-bar">Send up to 10 GB</li>
            <li>
              <button className={`selecBtn ${isAnnually ? 'active-btn' : ''}`}>
                SELECT
              </button>
            </li>
          </ul>
        </div>
        <div className="card ">
          <ul className="pricing-list">
            <li className="pack">Master</li>
            <li id="master" className="price bottom-bar">
              {isAnnually ? '$399.99' : '$39.99'}
            </li>
            <li className="bottom-bar">2 TB Storage</li>
            <li className="bottom-bar">10 Users Allowed</li>
            <li className="bottom-bar">Send up to 20 GB</li>
            <li>
              <button className="selecBtn">SELECT</button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default HireExpert;
