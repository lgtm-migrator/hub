import React from 'react';
import CircularProgress from 'material-ui/CircularProgress';
import Text from './Text';

const Loading = ({ message }) => (
  <div className="loading">
    <CircularProgress
      size={300}
      thickness={7}
      mode="indeterminate"
    />
    <Text>{message}</Text>
    <style jsx>{`
      .loading {
        width: 100%;
        text-align: center;
      }
    `}</style>
  </div>
);

export default Loading;
