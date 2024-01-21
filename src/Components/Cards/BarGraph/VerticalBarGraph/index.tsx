import { Graph } from './Graph';
import { VerticalBarGraphDataType } from '../../../../types';
import { Source } from '../../../Typography/Source';
import { GraphTitle } from '../../../Typography/GraphTitle';
import { GraphDescription } from '../../../Typography/GraphDescription';
import { FootNote } from '../../../Typography/FootNote';

interface Props {
  data: VerticalBarGraphDataType[];
  color: string;
  graphTitle?: string;
  width?: number;
  height?: number;
  suffix?: string;
  prefix?: string;
  source?: string;
  graphDescription?: string;
  footNote?: string;
  sourceLink?: string;
  barPadding?: number;
  showBarLabel?: boolean;
  showBarValue?: boolean;
  showTicks?: boolean;
}

export function VerticalBarGraph(props: Props) {
  const {
    data,
    graphTitle,
    color,
    suffix,
    source,
    prefix,
    graphDescription,
    sourceLink,
    barPadding,
    showBarLabel,
    showBarValue,
    showTicks,
    height,
    width,
    footNote,
  } = props;
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div>
        {graphTitle ? <GraphTitle text={graphTitle} /> : null}
        {graphDescription ? <GraphDescription text={graphDescription} /> : null}
      </div>
      <div
        style={{
          flexGrow: 1,
          flexDirection: 'column',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div className='margin-bottom-05'>
          <Graph
            data={data}
            barColor={color}
            width={width || 640}
            height={height || 480}
            suffix={suffix}
            prefix={prefix}
            barPadding={barPadding === undefined ? 0.25 : barPadding}
            showBarLabel={showBarLabel === undefined ? true : showBarLabel}
            showBarValue={showBarValue === undefined ? true : showBarValue}
            showTicks={showTicks === undefined ? true : showTicks}
          />
        </div>
      </div>
      {source ? <Source text={source} link={sourceLink} /> : null}
      {footNote ? <FootNote text={footNote} /> : null}
    </div>
  );
}
