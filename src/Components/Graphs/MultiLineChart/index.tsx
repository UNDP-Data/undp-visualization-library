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
import { Graph } from './Graph';

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

export function MultiLineChart(props: Props) {
  const { data, indicators, countries } = props;
  const {
    multiCountryTrendChartCountries,
    updateMultiCountryTrendChartCountries,
  } = useContext(Context) as CtxDataType;

  const [svgWidth, setSvgWidth] = useState(0);
  const [svgHeight, setSvgHeight] = useState(0);
  const graphDiv = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (graphDiv.current) {
      setSvgHeight(graphDiv.current.clientHeight);
      setSvgWidth(graphDiv.current.clientWidth);
    }
  }, [graphDiv]);
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
          mode='multiple'
          className='undp-select'
          placeholder='Please select a country'
          onChange={d => {
            updateMultiCountryTrendChartCountries(d);
          }}
          value={multiCountryTrendChartCountries}
          maxTagCount='responsive'
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
      {multiCountryTrendChartCountries.length === 0 ||
      !multiCountryTrendChartCountries ? (
        <CountryAreaEl className='center-area-info-el'>
          <h5 className='undp-typography'>
            Please select countries to see their trends
          </h5>
          <Select
            showSearch
            mode='multiple'
            className='undp-select'
            placeholder='Please select a country'
            onChange={d => {
              updateMultiCountryTrendChartCountries(d);
            }}
            value={multiCountryTrendChartCountries}
            maxTagCount='responsive'
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
            <Graph
              data={data}
              indicators={indicators}
              svgWidth={svgWidth}
              svgHeight={svgHeight}
            />
          ) : null}
        </GraphDiv>
      )}
    </>
  );
}
