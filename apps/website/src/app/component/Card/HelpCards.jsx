import React from 'react';
import styles from './helpCard.module.css';
import { MdOutlineRocketLaunch } from 'react-icons/md';
import { FaRegCommentDots } from 'react-icons/fa';
import { FaRegComment } from 'react-icons/fa';
import { MdOutlineEmail } from 'react-icons/md';
import { FaRegUser } from 'react-icons/fa';
import { IoSearch } from 'react-icons/io5';

function HelpCards() {
  const cardData = [
    {
      id: 1,
      title: 'Getting Start',
      icons: (
        <MdOutlineRocketLaunch
          color="var(--black)"
          style={{ fontSize: 60, color: 'var(--see-green)' }}
          // icon={faRocket}
        />
      ),
    },
    {
      id: 2,
      title: 'Legal FAQs',
      icons: (
        <FaRegComment
          color="var(--black)"
          style={{ fontSize: 60, color: 'var(--see-green)' }}
          // icon={faComment}
        />
      ),
    },
    // {
    //   id: 3,
    //   title: "EMAIL ALTER",
    //   icons: (
    //     <MdOutlineEmail
    //       color="var(--black)"
    //       style={{ fontSize: 60, color: "var(--see-green)" }}
    //       // icon={faMailForward}
    //     />
    //   ),
    // },
    {
      id: 4,
      title: 'Manage Account ',
      icons: (
        <FaRegUser
          color="var(--black)"
          style={{ fontSize: 60, color: 'var(--see-green)' }}
          // icon={faUser}
        />
      ),
    },
    // {
    //   id: 5,
    //   title: "Write Reviews ",
    //   icons: (
    //     <FaRegCommentDots
    //       color="var(--black)"
    //       style={{ fontSize: 60, color: "var(--see-green)" }}
    //       // icon={faCommenting}
    //     />
    //   ),
    // },
    // {
    //   id: 6,
    //   title: "Job Search Tips",
    //   icons: (
    //     <IoSearch
    //       color="var(--black)"
    //       style={{ fontSize: 60, color: "var(--see-green)" }}
    //       // icon={faSearch}
    //     />
    //   ),
    // },
  ];

  return (
    <div className={styles.dash}>
      <div className={styles['upper-title-box']}>
        {' '}
        <h3>Our Help</h3>{' '}
        <div className={styles.text}>
          <p>Ready to jump back in</p>
        </div>
      </div>

      <div className={styles.container}>
        {cardData &&
          cardData?.map((card, id) => (
            <div key={id} className={`${styles.card} bg-[var(--white-color)]`}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  {card.icons}
                </div>
                <h1
                  style={{
                    fontSize: 18,
                    color: 'var(--black)',
                    marginTop: '2rem',
                  }}
                >
                  {card.title}
                </h1>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default HelpCards;
