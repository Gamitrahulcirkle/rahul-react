import React from "react";
import { useParams } from 'react-router-dom';

const PDP = () => {
  const { handle } = useParams();
  return (
    <>
      <div>
        PDP page of {handle}
      </div>
      <div></div>
    </>
  );
};

export default PDP;
