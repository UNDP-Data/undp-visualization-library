import UNDPColorModule from '@undp-data/undp-viz-colors';
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
  graphID?: string;
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
    graphID,
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
          ? 'var(--gray-200)'
          : backgroundColor,
        marginLeft: 'auto',
        marginRight: 'auto',
      }}
      id={graphID}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--spacing-03)',
          width: '100%',
          flexGrow: 1,
          justifyContent: 'space-between',
        }}
      >
        {graphTitle || graphDescription ? (
          <GraphHeader
            graphTitle={graphTitle}
            graphDescription={graphDescription}
            width={(radius || donutRadius) * 2}
          />
        ) : null}
        <div
          style={{
            flexGrow: radius ? 0 : 1,
            flexDirection: 'column',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'stretch',
            gap: 'var(--spacing-05)',
            flexWrap: 'wrap',
            width: '100%',
          }}
        >
          {graphLegend ? (
            <div
              style={{
                lineHeight: 0,
              }}
            >
              <div className='flex-div margin-bottom-00 flex-wrap flex-hor-align-center'>
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
                        {numberFormattingFunction(
                          d.value,
                          prefix || '',
                          suffix || '',
                        )}
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
            width={(radius || donutRadius) * 2}
          />
        ) : null}
      </div>
    </div>
  );
}
