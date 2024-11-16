/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react';
import { generateRandomString } from '../../Utils/generateRandomString';

/* eslint-disable jsx-a11y/label-has-associated-control */
interface Props {
  rtl?: boolean;
  options: {
    value: string;
    label: string;
  }[];
  language?: 'ar' | 'he' | 'en';
  defaultValue?: string[];
  onChange: (_d: string[]) => void;
  mode?: 'light' | 'dark';
}

function Checkbox(props: Props) {
  const { rtl, options, onChange, defaultValue, language, mode } = props;
  const [checkedItems, setCheckedItems] = useState(new Set(defaultValue || []));

  return (
    <div
      style={{
        direction: rtl ? 'rtl' : 'ltr',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.375rem 1rem',
      }}
      className={`undp-viz-checkbox${
        rtl ? ` ${language || 'ar'}` : ` ${language || 'en'}`
      }${mode === 'dark' ? ` dark-mode` : ''}`}
    >
      {options.map((d, i) => (
        <div className='undp-form-check' key={i}>
          <label
            style={{
              alignItems: 'center',
              display: 'flex',
              flexWrap: 'nowrap',
            }}
          >
            <input
              type='checkbox'
              className='undp-viz-checkbox'
              style={{ margin: rtl ? '0 0 0 0.5rem' : '0 0.5rem 0 0' }}
              checked={checkedItems.has(d.value)}
              onChange={() => {
                const updatedValues = new Set(checkedItems);
                if (updatedValues.has(d.value)) {
                  updatedValues.delete(d.value);
                } else {
                  updatedValues.add(d.value);
                }
                setCheckedItems(updatedValues);
                onChange(Array.from(updatedValues));
              }}
            />
            {d.label}
          </label>
        </div>
      ))}
    </div>
  );
}

export default Checkbox;
