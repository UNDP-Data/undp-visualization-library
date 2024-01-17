import { useContext, useState } from 'react';
import { line, curveMonotoneX } from 'd3-shape';
import { scaleLinear } from 'd3-scale';
import maxBy from 'lodash.maxby';
import minBy from 'lodash.minby';
import { format } from 'd3-format';
import UNDPColorModule from 'undp-viz-colors';
import styled from 'styled-components';
import {
  CtxDataType,
  CountryGroupDataType,
  HoverDataType,
  IndicatorMetaDataWithYear,
} from '../../Types';
import Context from '../../Context/Context';
import { Tooltip } from '../../Components/Tooltip';
import { MAX_TEXT_LENGTH } from '../../Constants';

interface Props {
  data: CountryGroupDataType[];
  indicators: IndicatorMetaDataWithYear[];
  svgWidth: number;
  svgHeight: number;
  country: string;
}

interface DataFormattedType {
  year: number;
  param?: number;
}

const XTickText = styled.text`
  font-size: 12px;
  @media (max-width: 980px) {
    font-size: 10px;
  }
  @media (max-width: 600px) {
    font-size: 9px;
  }
  @media (max-width: 420px) {
    display: none;
  }
`;

const LabelText = styled.text`
  font-size: 12px;
  @media (max-width: 980px) {
    font-size: 10px;
  }
  @media (max-width: 600px) {
    font-size: 9px;
  }
  @media (max-width: 420px) {
    display: 8px;
  }
`;

export function SingleAxisGraph(props: Props) {
  const { data, indicators, svgWidth, svgHeight, country } = props;
  const { xAxisIndicator, showLabel } = useContext(Context) as CtxDataType;
  const [hoverData, setHoverData] = useState<HoverDataType | undefined>(
    undefined,
  );
  const margin = {
    top: 40,
    bottom: 50,
    left: 90,
    right: 30,
  };
  const graphWidth = svgWidth - margin.left - margin.right;
  const graphHeight = svgHeight - margin.top - margin.bottom;

  const xIndicatorMetaData =
    indicators[
      indicators.findIndex(
        indicator => indicator.IndicatorLabelTable === xAxisIndicator,
      )
    ];

  const countryData =
    data[data.findIndex(d => d['Country or Area'] === country)];

  const minYear = xIndicatorMetaData.years[0];
  const maxYear = xIndicatorMetaData.years[xIndicatorMetaData.years.length - 1];

  const xIndicatorIndex = countryData?.indicators.findIndex(
    el => xIndicatorMetaData.DataKey === el.indicator,
  );

  const dataFormatted: DataFormattedType[] = [];

  for (let i = minYear; i < maxYear + 1; i += 1) {
    dataFormatted.push({
      year: i,
      param:
        xIndicatorIndex !== -1
          ? countryData?.indicators[xIndicatorIndex].yearlyData[
              countryData?.indicators[xIndicatorIndex].yearlyData.findIndex(
                d => d.year === i,
              )
            ]?.value
          : undefined,
    });
  }
  const minParam: number = minBy(dataFormatted, d => d.param)?.param
    ? (minBy(dataFormatted, d => d.param)?.param as number) > 0
      ? 0
      : (minBy(dataFormatted, d => d.param)?.param as number)
    : 0;
  const maxParam: number = maxBy(dataFormatted, d => d.param)?.param
    ? (maxBy(dataFormatted, d => d.param)?.param as number)
    : 0;

  const dataFilterd = dataFormatted.filter(d => d.param !== undefined);
  const minYearFiltered = minBy(dataFilterd, d => d.year)?.year
    ? minBy(dataFilterd, d => d.year)?.year
    : minYear;
  const maxYearFiltered = maxBy(dataFilterd, d => d.year)?.year
    ? maxBy(dataFilterd, d => d.year)?.year
    : maxYear;

  const x = scaleLinear()
    .domain([minYearFiltered as number, maxYearFiltered as number])
    .range([0, graphWidth]);
  const y1 = scaleLinear()
    .domain([minParam, maxParam])
    .range([graphHeight, 0])
    .nice();

  const dataParam1 = dataFormatted.filter(d => d.param !== undefined);

  const lineShape = line()
    .defined((d: any) => d.param !== undefined)
    .x((d: any) => x(d.year))
    .y((d: any) => y1(d.param))
    .curve(curveMonotoneX);
  const y1Ticks = y1.ticks(5);
  const xTicks = x.ticks(
    (maxYearFiltered as number) - (minYearFiltered as number) > 10 ||
      (maxYearFiltered as number) - (minYearFiltered as number) === 0
      ? 10
      : (maxYearFiltered as number) - (minYearFiltered as number),
  );
  return (
    <>
      {dataFilterd.length > 0 ? (
        <svg
          width='100%'
          height='100%'
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        >
          <g transform={`translate(${margin.left},${margin.top})`}>
            <line
              y1={graphHeight}
              y2={graphHeight}
              x1={-15}
              x2={graphWidth + 15}
              stroke='#AAA'
              strokeWidth={1}
            />
            <g>
              {y1Ticks.map((d, i) => (
                <g key={i}>
                  <line
                    y1={y1(d)}
                    y2={y1(d)}
                    x1={-15}
                    x2={-20}
                    stroke={UNDPColorModule.graphMainColor}
                    strokeWidth={1}
                  />
                  <text
                    x={-25}
                    y={y1(d)}
                    fill={UNDPColorModule.graphMainColor}
                    textAnchor='end'
                    fontSize={12}
                    dy={3}
                  >
                    {Math.abs(d) < 1 ? d : format('~s')(d).replace('G', 'B')}
                  </text>
                </g>
              ))}
              <line
                y1={0}
                y2={graphHeight}
                x1={-15}
                x2={-15}
                stroke={UNDPColorModule.graphMainColor}
                strokeWidth={1}
              />
              <LabelText
                transform={`translate(-60, ${graphHeight / 2}) rotate(-90)`}
                fill={UNDPColorModule.graphMainColor}
                textAnchor='middle'
                fontSize={12}
              >
                {xIndicatorMetaData.IndicatorLabelTable.length > MAX_TEXT_LENGTH
                  ? `${xIndicatorMetaData.IndicatorLabelTable.substring(
                      0,
                      MAX_TEXT_LENGTH,
                    )}...`
                  : xIndicatorMetaData.IndicatorLabelTable}
              </LabelText>
            </g>
            <g>
              {xTicks.map((d, i) => (
                <g key={i}>
                  <XTickText
                    y={graphHeight}
                    x={x(d)}
                    fill='#AAA'
                    textAnchor='middle'
                    fontSize={12}
                    dy={15}
                  >
                    {d}
                  </XTickText>
                </g>
              ))}
            </g>
            <g>
              <path
                d={lineShape(dataFormatted as any) as string}
                fill='none'
                stroke={UNDPColorModule.graphMainColor}
                strokeWidth={2}
              />
              <path
                d={lineShape(dataParam1 as any) as string}
                fill='none'
                stroke={UNDPColorModule.graphMainColor}
                strokeWidth={2}
                strokeDasharray='4 8'
              />
              {hoverData ? (
                <line
                  y1={0}
                  y2={graphHeight}
                  x1={hoverData.rows[0].year ? x(hoverData.rows[0].year) : 0}
                  x2={hoverData.rows[0].year ? x(hoverData.rows[0].year) : 0}
                  stroke='#212121'
                  strokeDasharray='4 8'
                  strokeWidth={1}
                />
              ) : null}
            </g>
            <g>
              {dataFormatted.map((d, i) => (
                <g key={i}>
                  {d.param !== undefined ? (
                    <g>
                      <circle
                        cx={x(d.year)}
                        cy={y1(d.param)}
                        r={
                          window.innerWidth > 960
                            ? 4
                            : window.innerWidth > 600
                            ? 3
                            : 2
                        }
                        fill={UNDPColorModule.graphMainColor}
                      />
                      {showLabel ? (
                        <text
                          x={x(d.year)}
                          y={y1(d.param)}
                          dy={16}
                          fontSize={12}
                          textAnchor='middle'
                          fill={UNDPColorModule.graphMainColor}
                          strokeWidth={0.25}
                          stroke='#fff'
                          fontWeight='bold'
                        >
                          {d.param < 1 ? d.param : format('~s')(d.param)}
                        </text>
                      ) : null}
                    </g>
                  ) : null}
                  <rect
                    x={x(d.year) - 3}
                    y={0}
                    width={6}
                    height={graphHeight}
                    fill='#fff'
                    opacity={0}
                    onMouseEnter={event => {
                      setHoverData({
                        country: countryData['Country or Area'],
                        continent: countryData['Group 1'],
                        rows: [
                          {
                            title: xAxisIndicator,
                            value: d.param !== undefined ? d.param : 'NA',
                            type: 'color',
                            year: d.year,
                            color: UNDPColorModule.graphMainColor,
                            prefix: xIndicatorMetaData?.LabelPrefix,
                            suffix: xIndicatorMetaData?.LabelSuffix,
                          },
                        ],
                        xPosition: event.clientX,
                        yPosition: event.clientY,
                      });
                    }}
                    onMouseMove={event => {
                      setHoverData({
                        country: countryData['Country or Area'],
                        continent: countryData['Group 1'],
                        rows: [
                          {
                            title: xAxisIndicator,
                            value: d.param !== undefined ? d.param : 'NA',
                            type: 'color',
                            year: d.year,
                            color: UNDPColorModule.graphMainColor,
                            prefix: xIndicatorMetaData?.LabelPrefix,
                            suffix: xIndicatorMetaData?.LabelSuffix,
                          },
                        ],
                        xPosition: event.clientX,
                        yPosition: event.clientY,
                      });
                    }}
                    onMouseLeave={() => {
                      setHoverData(undefined);
                    }}
                  />
                </g>
              ))}
            </g>
          </g>
        </svg>
      ) : (
        <div className='center-area-error-el'>
          No data available for {country}
        </div>
      )}
      {hoverData ? <Tooltip data={hoverData} /> : null}
    </>
  );
}
