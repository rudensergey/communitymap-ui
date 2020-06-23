import React from 'react';
import './PointingSegment.css';
import { ObjectItem } from '../index';

import PointerBox from './UI/PointerBox/PointerBox';

interface IPointingSegment {
  item: ObjectItem;
  children: object;
}

export const PointingSegment: React.FC<IPointingSegment> = ({
  item: { title, description, logoURL, short_description },
  children,
}) => (
  <PointerBox
    title={title}
    description={description}
    short_description={short_description}
    logoURL={logoURL}
  >
    {children}
  </PointerBox>
);
