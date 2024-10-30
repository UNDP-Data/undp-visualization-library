import { useState } from 'react';

/* eslint-disable jsx-a11y/label-has-associated-control */
interface Props {
  rtl?: boolean;
  options: {
    value: string;
    label: string;
  }[];
  language?: 'ar' | 'he' | 'en';
  defaultValue: string;
  onChange: (_d: string) => void;
  mode?: 'light' | 'dark';
}

function Radio(props: Props) {
  const { rtl, options, onChange, defaultValue, language, mode } = props;
  const [selectedOption, setSelectedOption] = useState(defaultValue);

  const handleOptionChange = (event: any) => {
    setSelectedOption(event.target.name);
    onChange(event.target.name);
  };

  return (
    <div
      style={{
        direction: rtl ? 'rtl' : 'ltr',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
      }}
    >
      {options.map((d, i) => (
        <label
          className={`undp-viz-radio${
            rtl ? ` ${language || 'ar'}` : ` ${language || 'en'}`
          }${mode === 'dark' ? ` dark-mode` : ''}`}
          key={i}
        >
          <input
            type='radio'
            className='undp-viz-radio'
            name={d.value}
            checked={selectedOption === d.value}
            onChange={handleOptionChange}
          />
          <p>{d.label}</p>
        </label>
      ))}
    </div>
  );
}

export default Radio;
