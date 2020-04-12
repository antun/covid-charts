import React from 'react';

import Classes from './DateSelector.module.css';

import { getOrdinalSuffix } from '../../utils/utils';

const dateSelector = (props) => {
  return (
    <div>
      <h3>Date Adjustments</h3>
      <div>
        <label>
          <input type="radio" value="exact"
            checked={props.dateAlignment==='exact'}
            onChange={props.onDateAlignmentTypeChange} />
          None
        </label>
      </div>
      <div>
        <label>
          <input type="radio" value="firstdeath"
            checked={props.dateAlignment==='firstdeath'}  onChange={props.onDateAlignmentTypeChange}  />
          Match dates of&nbsp;
          <input type="number" value={props.dateAlignmentOffset}
            onChange={props.onDateAlignmentOffsestChange}
            disabled={props.dateAlignment !== 'firstdeath'}
            className={Classes.OffsetInput} />{getOrdinalSuffix(props.dateAlignmentOffset)}&nbsp;
          death
        </label>
      </div>
    </div>
  );
};

export default dateSelector;
