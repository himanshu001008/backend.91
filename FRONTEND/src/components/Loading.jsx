import React from 'react';
import LoadingSpinner from './LoadingSpinner';
import SkeletonLoader from './SkeletonLoader';

const Loading = ({ type = 'spinner', text = 'Loading...', fullScreen = false, count = 1 }) => {
  if (type === 'cardSkeleton') {
    return <SkeletonLoader type="card" count={count} />;
  }

  if (type === 'listSkeleton') {
    return <SkeletonLoader type="list" count={count} />;
  }

  if (type === 'detailSkeleton') {
    return <SkeletonLoader type="detail" count={count} />;
  }

  return <LoadingSpinner text={text} fullScreen={fullScreen} />;
};

export default Loading;
