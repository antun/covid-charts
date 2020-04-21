import React from 'react';

import Classes from './DateSelector.module.css';

import { getOrdinalSuffix } from '../../utils/utils';

const dateSelector = (props) => {
  return (
    <div>
      <h3>Date Adjustments</h3>
      <div className={Classes.radioRow}>
        <label>
          <input type="radio" value="exact"
            checked={props.dateAlignment==='exact'}
            onChange={props.onDateAlignmentTypeChange} />
          None
        </label>
      </div>
      <div className={Classes.radioRow}>
        <label>
          <input type="radio" value="nthdeath"
            checked={props.dateAlignment==='nthdeath'}  onChange={props.onDateAlignmentTypeChange}  />
          Match dates of&nbsp;
          <input type="number" value={props.dateAlignmentDeathOffset}
            onChange={props.onDateAlignmentDeathOffsestChange}
            disabled={props.dateAlignment !== 'nthdeath'}
            className={Classes.OffsetInput} />{getOrdinalSuffix(props.dateAlignmentDeathOffset)}&nbsp;
          death
        </label>
      </div>
      <div className={Classes.radioRow}>
        <label>
          <input type="radio" value="nthcase"
            checked={props.dateAlignment==='nthcase'}  onChange={props.onDateAlignmentTypeChange}  />
          Match dates of&nbsp;
          <input type="number" value={props.dateAlignmentCaseOffset}
            onChange={props.onDateAlignmentCaseOffsestChange}
            disabled={props.dateAlignment !== 'nthcase'}
            className={Classes.OffsetInput} />{getOrdinalSuffix(props.dateAlignmentCaseOffset)}&nbsp;
          confirmed case
        </label>
      </div>
    </div>
  );
};

export default dateSelector;
