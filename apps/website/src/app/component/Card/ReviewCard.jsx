import React from 'react';
import styles from './ReviewCard.module.css';
import { FaStar } from 'react-icons/fa6';
import { FaRegThumbsUp } from 'react-icons/fa6';
import Rating from '@mui/material/Rating';
function HelpCards() {
  const cardData = [
    {
      id: 1,
      numner: 3.0,
      icons: (
        <FaStar
          color="var(--black)"
          style={{ color: 'var(--primary-color)' }}
          //  icon={faStar}
        />
      ),
      title: 'Amazing Experience',
      location: 'Formar Employee Karachi',
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text scrambled Lorem Ipsum is simply dummy text of the printing and typesetting industry Lorem Ipsum is simply dummy text of the printing and typesetting industry Lorem Ipsum is simply dummy text of the printing and typesetting industry",
    },
    {
      id: 1,
      numner: 4.3,
      icons: (
        <FaStar
          color="var(--black)"
          style={{ color: 'var(--primary-color)' }}
          //  icon={faStar}
        />
      ),
      title: 'Amazing Experience',
      location: 'Formar Employee Karachi',
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text scrambled",
    },
    {
      id: 1,
      numner: 4.8,
      icons: (
        <FaStar
          color="var(--black)"
          style={{ color: 'var(--primary-color)' }}
          //  icon={faStar}
        />
      ),
      title: 'Amazing Experience',
      location: 'Formar Employee Karachi',
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text scrambled",
    },
    {
      id: 1,
      numner: 3.5,
      icons: (
        <FaStar
          color="var(--black)"
          style={{ color: 'var(--primary-color)' }}
          // icon={faStar}
        />
      ),
      title: 'Amazing Experience',
      location: 'Formar Employee Karachi',
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text scrambled",
    },
  ];

  return (
    <div className={styles.container}>
      <div>
        <h1 className={styles.heading}>Company Reviews</h1>
        <p>
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry
        </p>
      </div>
      {cardData &&
        cardData?.map((card, id) => (
          <div key={id} className={`${styles.review} bg-[var(--white-color)]`}>
            <div>
              <Rating
                style={{ color: 'var(--primary-color)' }}
                name="read-only"
                value={3}
                readOnly
              />
              <h1
                style={{
                  fontSize: 18,
                  color: 'var(--black)',
                  marginTop: '.5rem',
                }}
              >
                {card.title}
              </h1>
              <span className={styles.loc}>{card.location}</span>
              <p className={styles.dec}>{card.description}</p>
            </div>
          </div>
        ))}
    </div>
  );
}

export default HelpCards;
