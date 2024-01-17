import { Select } from 'antd';
import { useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Context from '../../Context/Context';
import {
  CountryGroupDataType,
  CountryListType,
  CtxDataType,
  IndicatorMetaDataWithYear,
} from '../../Types';
import { DualAxisGraph } from './DualAxisGraph';
import { SingleAxisGraph } from './SingleAxisGraph';

interface Props {
  data: CountryGroupDataType[];
  indicators: IndicatorMetaDataWithYear[];
  countries: CountryListType[];
}

const GraphDiv = styled.div`
  flex-grow: 1;
  @media (max-width: 960px) {
    height: 70vw;
    max-height: 31.25rem;
  }
`;

const CountryAreaEl = styled.div`
  @media (max-width: 980px) {
    display: none;
  }
`;

export function LineChart(props: Props) {
  const { data, indicators, countries } = props;
  const {
    trendChartCountry,
    updateTrendChartCountry,
    selectedCountryOrRegion,
    yAxisIndicator,
  } = useContext(Context) as CtxDataType;

  const [svgWidth, setSvgWidth] = useState(0);
  const [svgHeight, setSvgHeight] = useState(0);
  const graphDiv = useRef<HTMLDivElement>(null);
  const country = selectedCountryOrRegion
    ? countries[countries.findIndex(d => d.code === selectedCountryOrRegion)]
        .name
    : trendChartCountry;
  useEffect(() => {
    if (graphDiv.current) {
      setSvgHeight(graphDiv.current.clientHeight);
      setSvgWidth(graphDiv.current.clientWidth);
    }
  }, [graphDiv, selectedCountryOrRegion, trendChartCountry]);
  return (
    <>
      <div
        style={{
          padding: 'var(--spacing-06)',
          backgroundColor: 'var(--white)',
          borderBottom: '1px solid var(--gray-400)',
        }}
      >
        <Select
          showSearch
          className='undp-select'
          placeholder='Please select a country'
          onChange={d => {
            updateTrendChartCountry(d);
          }}
          disabled={selectedCountryOrRegion !== undefined}
          value={
            countries[
              countries.findIndex(d => d.code === selectedCountryOrRegion)
            ]?.name || trendChartCountry
          }
        >
          {countries
            .map(d => d.name)
            .map(d => (
              <Select.Option className='undp-select-option' key={d}>
                {d}
              </Select.Option>
            ))}
        </Select>
      </div>
      {!country ? (
        <CountryAreaEl className='center-area-info-el'>
          <h5 className='undp-typography'>
            Please select a country to see the trend for that country
          </h5>
          <Select
            showSearch
            className='undp-select'
            placeholder='Please select a country'
            value={trendChartCountry}
            onChange={d => {
              updateTrendChartCountry(d);
            }}
          >
            {countries
              .map(d => d.name)
              .map(d => (
                <Select.Option className='undp-select-option' key={d}>
                  {d}
                </Select.Option>
              ))}
          </Select>
        </CountryAreaEl>
      ) : (
        <GraphDiv ref={graphDiv}>
          {svgHeight && svgWidth ? (
            yAxisIndicator ? (
              <DualAxisGraph
                data={data}
                indicators={indicators}
                svgWidth={svgWidth}
                svgHeight={svgHeight}
                country={country}
              />
            ) : (
              <SingleAxisGraph
                data={data}
                indicators={indicators}
                svgWidth={svgWidth}
                svgHeight={svgHeight}
                country={country}
              />
            )
          ) : null}
        </GraphDiv>
      )}
    </>
  );
}
