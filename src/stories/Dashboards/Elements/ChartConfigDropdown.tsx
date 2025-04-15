/* eslint-disable jsx-a11y/label-has-associated-control */
import { useState } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Source } from '@storybook/blocks';
import { GraphNames } from '@/stories/assets/constants';
import { GraphDataConfigSelector } from '@/stories/assets/GraphDataConfigSelector';
import { GraphSettingsSelector } from '@/stories/assets/GraphSettingsSelector';

interface Props {
  type: 'graphType' | 'graphSettings' | 'dataSettings';
}

export function ChartConfigDropdown(props: Props) {
  const { type } = props;
  const [selected, setSelected] = useState('Bar graph');

  const codeBlock =
    type === 'graphType'
      ? `graphType='${
          GraphNames[GraphNames.findIndex(d => d.name === selected)].id
        }'`
      : type === 'graphSettings'
      ? `graphSettings={${GraphSettingsSelector(selected, true, false)}}`
      : type === 'dataSettings'
      ? `dataSettings={${GraphDataConfigSelector(selected)}}`
      : ``;

  return (
    <div style={{ marginTop: '1rem' }}>
      <label htmlFor='chart-select'>
        <strong>Chart Type: </strong>
      </label>
      <select
        id='chart-select'
        value={selected}
        onChange={e => setSelected(e.target.value)}
      >
        {GraphNames.map(d => d.name)
          .sort()
          .map(key => (
            <option key={key} value={key}>
              {key}
            </option>
          ))}
      </select>
      <Source code={codeBlock} language='tsx' />
    </div>
  );
}
