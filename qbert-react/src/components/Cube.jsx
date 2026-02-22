import React from 'react';
import './Cube.css';

const Cube = ({ color }) => {
  return <div className="cube" style={{ backgroundColor: color }}></div>;
};

export default Cube;
