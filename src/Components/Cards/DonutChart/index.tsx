import UNDPColorModule from 'undp-viz-colors';
import { Graph } from './Graph';
import { FootNote } from '../../Typography/FootNote';
import { GraphDescription } from '../../Typography/GraphDescription';
import { GraphTitle } from '../../Typography/GraphTitle';
import { Source } from '../../Typography/Source';
import { DonutChartDataType } from '../../../types';
import { numberFormattingFunction } from '../../../Utils/numberFormattingFunction';

interface Props {
  mainText?: string;
  data: DonutChartDataType[];
  colors?: string[];
  graphTitle?: string;
  suffix?: string;
  prefix?: string;
  source?: string;
  graphDescription?: string;
  sourceLink?: string;
  subNote?: string;
  footNote?: string;
  radius?: number;
  strokeWidth?: number;
  graphLegend?: boolean;
}

export function DonutChart(props: Props) {
  const {
    mainText,
    graphTitle,
    colors,
    suffix,
    source,
    prefix,
    strokeWidth,
    graphDescription,
    sourceLink,
    subNote,
    footNote,
    radius,
    data,
    graphLegend,
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
          padding: '0 var(--spacing-07)',
        }}
      >
        <div
          className='flex-div gap-09'
          style={{
            flexWrap: 'nowrap',
            alignItems: 'flex-end',
          }}
        >
          <Graph
            mainText={mainText}
            data={data}
            colors={colors || UNDPColorModule.categoricalColors.colors}
            radius={radius || 210}
            subNote={subNote}
            strokeWidth={strokeWidth || 50}
          />
          {graphLegend === false ? null : (
            <div>
              {data.map((d, i) => (
                <div
                  key={i}
                  className='flex-div gap-03 margin-bottom-03'
                  style={{
                    flexWrap: 'nowrap',
                    alignItems: 'center',
                    marginBottom: i < data.length - 1 ? 'var(--spacing-03)' : 0,
                  }}
                >
                  <div
                    style={{
                      width: '0.75rem',
                      height: '0.75rem',
                      borderRadius: '0.75rem',
                      backgroundColor: colors
                        ? colors[i]
                        : UNDPColorModule.categoricalColors.colors[i],
                    }}
                  />
                  <p className='margin-bottom-00 margin-top-00 undp-typography'>
                    {d.label}:{' '}
                    <span className='bold'>
                      {prefix}
                      {numberFormattingFunction(d.value)}
                      {suffix}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {source ? <Source text={source} link={sourceLink} /> : null}
      {footNote ? <FootNote text={footNote} /> : null}
    </div>
  );
}
