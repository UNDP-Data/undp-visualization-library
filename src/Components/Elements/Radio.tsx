import { useEffect, useState } from 'react';

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
  const [selectedOption, setSelectedOption] = useState(
    defaultValue.replace(/[^\p{L}0-9-_]+/gu, '_'),
  );
  const idString = Math.random().toString(36).substring(2, 8);
  const [optionsForGroup, setOptionsForGroup] = useState(
    options.map(d => ({
      ...d,
      name: d.value.replace(/[^\p{L}0-9-_]+/gu, '_'),
    })),
  );

  useEffect(() => {
    setSelectedOption(defaultValue.replace(/[^\p{L}0-9-_]+/gu, '_'));
  }, [defaultValue]);

  useEffect(() => {
    setOptionsForGroup(
      options.map(d => ({
        ...d,
        name: d.value.replace(/[^\p{L}0-9-_]+/gu, '_'),
      })),
    );
  }, [options]);

  return (
    <div
      style={{
        direction: rtl ? 'rtl' : 'ltr',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
      }}
      className={`undp-viz-radio${
        rtl ? ` ${language || 'ar'}` : ` ${language || 'en'}`
      }${mode === 'dark' ? ` dark-mode` : ''}`}
    >
      {optionsForGroup.map((d, i) => (
        <div className='undp-form-check' key={i}>
          <input
            type='radio'
            className='undp-viz-radio'
            name={d.name}
            id={`${idString}-${d.name}`}
            checked={selectedOption === d.name}
            onChange={e => {
              if (
                optionsForGroup.findIndex(el => el.name === e.target.name) !==
                -1
              ) {
                setSelectedOption(e.target.name);
                onChange(
                  optionsForGroup[
                    optionsForGroup.findIndex(el => el.name === e.target.name)
                  ].value,
                );
              }
            }}
          />
          <label htmlFor={`${idString}-${d.name}`}>{d.label}</label>
        </div>
      ))}
    </div>
  );
}

export default Radio;
