import UNDPColorModule from 'undp-viz-colors';
import { useEffect, useRef, useState } from 'react';
import min from 'lodash.min';
import { Graph } from './Graph';
import { DonutChartDataType } from '../../../Types';
import { numberFormattingFunction } from '../../../Utils/numberFormattingFunction';
import { GraphFooter } from '../../Elements/GraphFooter';
import { GraphHeader } from '../../Elements/GraphHeader';

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
  backgroundColor?: string | boolean;
  padding?: string;
  tooltip?: (_d: any) => JSX.Element;
  onSeriesMouseOver?: (_d: any) => void;
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
    padding,
    backgroundColor,
    tooltip,
    onSeriesMouseOver,
  } = props;

  const [donutRadius, setDonutRadius] = useState(0);

  const graphDiv = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (graphDiv.current) {
      setDonutRadius(
        (min([graphDiv.current.clientWidth, graphDiv.current.clientHeight]) ||
          420) / 2,
      );
    }
  }, [graphDiv?.current]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: radius ? 'fit-content' : '100%',
        padding: backgroundColor
          ? padding || 'var(--spacing-05)'
          : padding || 0,
        backgroundColor: !backgroundColor
          ? 'transparent'
          : backgroundColor === true
          ? 'var(--gray-100)'
          : backgroundColor,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--spacing-03)',
          width: '100%',
        }}
      >
        {graphTitle || graphDescription ? (
          <GraphHeader
            graphTitle={graphTitle}
            graphDescription={graphDescription}
          />
        ) : null}
        <div
          style={{
            flexGrow: 1,
            flexDirection: 'column',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 'var(--spacing-05)',
            width: '100%',
          }}
        >
          {graphLegend ? (
            <div
              style={{
                lineHeight: 0,
              }}
            >
              <div className='flex-div margin-bottom-00 flex-wrap'>
                {data.map((d, i) => (
                  <div
                    className='flex-div gap-03 flex-vert-align-center'
                    key={i}
                  >
                    <div
                      style={{
                        width: '0.75rem',
                        height: '0.75rem',
                        borderRadius: '1rem',
                        backgroundColor: colors
                          ? colors[i]
                          : UNDPColorModule.categoricalColors.colors[i],
                      }}
                    />
                    <p className='undp-typography margin-bottom-00 small-font'>
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
            </div>
          ) : null}
          <div
            style={{
              flexGrow: 1,
              width: '100%',
              lineHeight: 0,
              display: 'flex',
              justifyContent: 'center',
            }}
            ref={graphDiv}
          >
            {radius || donutRadius ? (
              <div>
                <Graph
                  mainText={mainText}
                  data={data}
                  colors={colors || UNDPColorModule.categoricalColors.colors}
                  radius={radius || donutRadius}
                  subNote={subNote}
                  strokeWidth={strokeWidth || 50}
                  tooltip={tooltip}
                  onSeriesMouseOver={onSeriesMouseOver}
                />
              </div>
            ) : null}
          </div>
        </div>
        {source || footNote ? (
          <GraphFooter
            source={source}
            sourceLink={sourceLink}
            footNote={footNote}
          />
        ) : null}
      </div>
    </div>
  );
}
