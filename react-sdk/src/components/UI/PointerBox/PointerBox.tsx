import React from 'react';
import './--default.css';

const PointerBox: React.FC<IPointerBox> = ({
  title,
  description,
  short_description,
  logoURL,
  children,
}) => {
  return (
    <div className="pointerbox">
      <div className="pointerbox__info">
        <div style={{backgroundImage: `url(${logoURL})`}} className="pointerbox__logo"></div>
        <h6 className="pointerbox__title">{title}</h6>
        <p className="pointerbox__description">{short_description}</p>
      </div>
      <svg
        width="25"
        height="10"
        viewBox="0 0 103 52"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M0.262451 0L51.5 51.2375L102.738 0H0.262451Z"
          fill="white"
        />
      </svg>
    </div>
  );
};

interface IPointerBox {
  title: string;
  description: string;
  short_description: string | undefined;
  logoURL: string | undefined;
}

export default PointerBox;
