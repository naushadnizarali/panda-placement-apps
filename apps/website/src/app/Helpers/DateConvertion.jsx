const ChangeDate = (dateValue) => {
  const postedTimestamp = new Date(dateValue);
  const currentTimestamp = new Date();
  const timeDifference = currentTimestamp - postedTimestamp;
  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  let timeAgo;
  if (seconds < minutes) {
    timeAgo = 'just now';
  } else if (weeks > 0) {
    timeAgo = `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  } else if (days > 0) {
    timeAgo = `${days} day${days > 1 ? 's' : ''} ago`;
  } else if (hours > 0) {
    timeAgo = `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (minutes > 0) {
    timeAgo = `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else {
    timeAgo = `${seconds} second${seconds > 1 ? 's' : ''} ago`;
  }
  return timeAgo;
};

export default ChangeDate;
