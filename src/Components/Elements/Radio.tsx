import { useState } from 'react';

/* eslint-disable jsx-a11y/label-has-associated-control */

interface Option {
  value: string | string[];
  label: string;
  [key: string]: any;
}
interface Props {
  rtl?: boolean;
  options: Option[];
  language?: 'ar' | 'he' | 'en';
  defaultValue: string;
  onChange: (_d: Option) => void;
  mode?: 'light' | 'dark';
}

function Radio(props: Props) {
  const { rtl, options, onChange, defaultValue, language, mode } = props;
  const [selectedOption, setSelectedOption] = useState(defaultValue);
  return (
    <div
      style={{
        direction: rtl ? 'rtl' : 'ltr',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.375rem 1rem',
      }}
      className={`undp-viz-radio${
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
              type='radio'
              className='undp-viz-radio'
              style={{ margin: rtl ? '0 0 0 0.5rem' : '0 0.5rem 0 0' }}
              checked={selectedOption === d.label}
              onChange={() => {
                setSelectedOption(d.label);
                onChange(d);
              }}
            />
            {d.label}
          </label>
        </div>
      ))}
    </div>
  );
}

export default Radio;
