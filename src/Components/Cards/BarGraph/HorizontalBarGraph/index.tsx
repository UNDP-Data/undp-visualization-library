import { Graph } from './Graph';
import { HorizontalBarGraphDataType } from '../../../../types';
import { Source } from '../../../Typography/Source';
import { GraphTitle } from '../../../Typography/GraphTitle';
import { GraphDescription } from '../../../Typography/GraphDescription';
import { FootNote } from '../../../Typography/FootNote';

interface Props {
  data: HorizontalBarGraphDataType[];
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
  showBarValue?: boolean;
  showTicks?: boolean;
  leftMargin?: number;
  truncateBy?: number;
}

export function HorizontalBarGraph(props: Props) {
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
    showBarValue,
    showTicks,
    leftMargin,
    truncateBy,
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
            showBarValue={showBarValue === undefined ? true : showBarValue}
            showTicks={showTicks === undefined ? true : showTicks}
            leftMargin={leftMargin === undefined ? 100 : leftMargin}
            truncateBy={truncateBy === undefined ? 0 : truncateBy}
          />
        </div>
      </div>
      {source ? <Source text={source} link={sourceLink} /> : null}
      {footNote ? <FootNote text={footNote} /> : null}
    </div>
  );
}
