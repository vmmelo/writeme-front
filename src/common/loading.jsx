import React from 'react';
import PropTypes from 'prop-types';

function Loading(props) {
  const { hide, className } = props;

  if (hide) return <React.Fragment />;

  return (
    <div className={className ? `${className} loader-container` : 'loader-container'}>
      <div className="loader" />
    </div>
  );
}

Loading.propTypes = {
  hide: PropTypes.bool,
  className: PropTypes.string,
};

Loading.defaultProps = {
  hide: false,
  className: '',
};

export default Loading;
