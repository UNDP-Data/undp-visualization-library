import { useEffect, useState } from 'react';

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
  const [checkedItems, setCheckedItems] = useState(
    options.map(d => ({
      name: d.value.replace(/[^\p{L}0-9-_]+/gu, '_'),
      checked: defaultValue ? defaultValue.indexOf(d.value) !== -1 : false,
    })),
  );
  const [optionsForGroup, setOptionsForGroup] = useState(
    options.map(d => ({
      ...d,
      name: d.value.replace(/[^\p{L}0-9-_]+/gu, '_'),
    })),
  );
  const idString = Math.random().toString(36).substring(2, 8);

  const handleCheckboxChange = (event: any) => {
    const checkedItemTemp = [...checkedItems];
    checkedItemTemp[
      checkedItemTemp.findIndex(d => d.name === event.target.name)
    ].checked = event.target.checked;
    setCheckedItems(checkedItemTemp);
    onChange(
      checkedItemTemp
        .filter(d => d.checked)
        .map(
          d =>
            optionsForGroup[optionsForGroup.findIndex(el => el.name === d.name)]
              .value,
        ),
    );
  };

  useEffect(() => {
    setCheckedItems(
      options.map(d => ({
        name: d.value.replace(/[^\p{L}0-9-_]+/gu, '_'),
        checked: defaultValue ? defaultValue.indexOf(d.value) !== -1 : false,
      })),
    );
  }, [defaultValue, options]);

  useEffect(() => {
    setCheckedItems(
      options.map(d => ({
        name: d.value.replace(/[^\p{L}0-9-_]+/gu, '_'),
        checked: defaultValue ? defaultValue.indexOf(d.value) !== -1 : false,
      })),
    );
  }, [options]);

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
      className={`undp-viz-checkbox${
        rtl ? ` ${language || 'ar'}` : ` ${language || 'en'}`
      }${mode === 'dark' ? ` dark-mode` : ''}`}
    >
      {optionsForGroup.map((d, i) => (
        <div className='undp-form-check' key={i}>
          <input
            type='checkbox'
            className='undp-viz-checkbox'
            name={d.name}
            id={`${idString}-${d.name}`}
            checked={
              checkedItems[checkedItems.findIndex(el => el.name === d.name)]
                .checked
            }
            onChange={handleCheckboxChange}
          />
          <label htmlFor={`${idString}-${d.name}`}>{d.label}</label>
        </div>
      ))}
    </div>
  );
}

export default Checkbox;
