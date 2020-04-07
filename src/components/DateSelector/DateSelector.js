import React from 'react';

const dateSelector = (props) => {
  return (
    <div>
      <h3>Date Adjustments</h3>
      <div>
        <label>
          <input type="radio" value="exact" checked={props.dateAlignment==='exact'} onChange={props.onDateAlignmentTypeChange} />
          None
        </label>
      </div>
      <div>
        <label>
          <input type="radio" value="firstdeath" checked={props.dateAlignment==='firstdeath'}  onChange={props.onDateAlignmentTypeChange}  />
          Match dates of first death
        </label>
      </div>
    </div>
  );
};

export default dateSelector;
