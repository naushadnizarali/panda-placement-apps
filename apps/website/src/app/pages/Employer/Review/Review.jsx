import React, { useEffect } from 'react';

import ReviewCard from '../../../component/Card/ReviewCard';
import { DynamicTitle } from '../../../Helpers/DynamicTitle';
function Review() {
  useEffect(() => {
    DynamicTitle('Review-PandaPlacement');
  }, []);

  return (
    <>
      <ReviewCard />
    </>
  );
}

export default Review;
