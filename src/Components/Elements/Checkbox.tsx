import { useState } from 'react';

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
}

function Checkbox(props: Props) {
  const { rtl, options, onChange, defaultValue, language } = props;
  const [checkedItems, setCheckedItems] = useState(
    options.map(d => ({
      value: d.value,
      checked: defaultValue ? defaultValue.indexOf(d.value) !== -1 : false,
    })),
  );

  const handleCheckboxChange = (event: any) => {
    const checkedItemTemp = [...checkedItems];
    checkedItemTemp[
      checkedItemTemp.findIndex(d => d.value === event.target.name)
    ].checked = event.target.checked;
    setCheckedItems(checkedItemTemp);
    onChange(checkedItemTemp.filter(d => d.checked).map(d => d.value));
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
          className={`undp-checkbox${
            rtl ? ` ${language || 'ar'}` : ` ${language || 'en'}`
          }`}
          key={i}
        >
          <input
            type='checkbox'
            name={d.value}
            checked={
              checkedItems[checkedItems.findIndex(el => el.value === d.value)]
                .checked
            }
            onChange={handleCheckboxChange}
          />
          <span className='undp-checkbox-box' />
          {d.label}
        </label>
      ))}
    </div>
  );
}

export default Checkbox;
