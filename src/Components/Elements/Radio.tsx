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
}

function Radio(props: Props) {
  const { rtl, options, onChange, defaultValue, language } = props;
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
          className={`undp-radio${
            rtl ? ` ${language || 'ar'}` : ` ${language || 'en'}`
          }`}
          key={i}
        >
          <input
            type='radio'
            name={d.value}
            checked={selectedOption === d.value}
            onChange={handleOptionChange}
          />
          <span className='undp-radio-box' />
          {d.label}
        </label>
      ))}
    </div>
  );
}

export default Radio;
