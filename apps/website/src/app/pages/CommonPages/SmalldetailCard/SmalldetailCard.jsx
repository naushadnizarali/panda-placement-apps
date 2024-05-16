import React from 'react';
import styles from './SmalldetailCard.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function SmalldetailCard({ icon, title, detail, color }) {
  return (
    <div className={styles.wrapper}>
      {icon ? (
        <div className={styles.iconcontainer}>
          {React.createElement(icon, {
            style: { fontSize: '24px', color: color },
          })}
        </div>
      ) : null}

      <div className={icon ? styles.detailsWrapper : styles.detailsWrapper2}>
        <h6>{title ?? '----'}</h6>
        <p>{detail ?? '----'}</p>
      </div>
    </div>
  );
}

export default SmalldetailCard;

// import React from "react";
// import styles from "./SmalldetailCard.module.css";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// function SmalldetailCard({ icon, title, detail, color }) {
//   return (
//     <div className={styles.wrapper}>
//       {icon ? (
//         <div className={styles.iconcontainer}>
//           <FontAwesomeIcon
//             color={color}
//             style={{ height: "100%", width: "100%" }}
//             icon={icon}
//           />
//         </div>
//       ) : null}

//       <div className={icon ? styles.detailsWrapper : styles.detailsWrapper2}>
//         <h6>{title ?? "----"}</h6>
//         <p>{detail ?? "----"}</p>
//       </div>
//     </div>
//   );
// }

// export default SmalldetailCard;
