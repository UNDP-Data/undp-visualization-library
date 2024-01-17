import { useContext, useEffect, useRef, useState } from 'react';
import { geoEqualEarth } from 'd3-geo';
import { zoom } from 'd3-zoom';
import { format } from 'd3-format';
import { select } from 'd3-selection';
import maxBy from 'lodash.maxby';
import max from 'lodash.max';
import { scaleThreshold, scaleOrdinal, scaleSqrt } from 'd3-scale';
import World from '../../Data/worldMap.json';
import { Tooltip } from '../../Components/Tooltip';

interface Props {
  svgWidth: number;
  svgHeight: number;
  valueArrayForColorScale: number[];
  colorArrayForColorScale: string[];
  isDataCategorical: boolean;
  data: CountryGroupDataType[];
}

export function UnivariateMap(props: Props) {
  const {
    data,
    valueArrayForColorScale,
    isDataCategorical,
    colorArrayForColorScale,
    svgWidth,
    svgHeight,
  } = props;
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    undefined,
  );
  const [hoverData, setHoverData] = useState<HoverDataType | undefined>(
    undefined,
  );
  const mapSvg = useRef<SVGSVGElement>(null);
  const mapG = useRef<SVGGElement>(null);
  const projection = geoEqualEarth()
    .rotate([0, 0])
    .scale(180)
    .translate([470, 315]);
  const colorScale = isDataCategorical
    ? scaleOrdinal<number, string>()
        .domain(valueArrayForColorScale)
        .range(colorArrayForColorScale)
    : scaleThreshold<number, string>()
        .domain(valueArrayForColorScale)
        .range(colorArrayForColorScale);

  useEffect(() => {
    const mapGSelect = select(mapG.current);
    const mapSvgSelect = select(mapSvg.current);
    const zoomBehaviour = zoom()
      .scaleExtent([1, 6])
      .translateExtent([
        [-20, 0],
        [svgWidth + 20, svgHeight],
      ])
      .on('zoom', ({ transform }) => {
        mapGSelect.attr('transform', transform);
      });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mapSvgSelect.call(zoomBehaviour as any);
  }, [svgHeight, svgWidth]);
  return (
    <>
      <svg
        width='100%'
        height='100%'
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        ref={mapSvg}
      >
        <g ref={mapG}>
          {(World as any).features.map((d: any, i: number) => {
            const index = data.findIndex(
              (el: any) => el['Alpha-3 code'] === d.properties.ISO3,
            );
            if (index !== -1 || d.properties.NAME === 'Antarctica') return null;
            return (
              <g key={i} opacity={!selectedColor ? 1 : 0.3}>
                {d.geometry.type === 'MultiPolygon'
                  ? d.geometry.coordinates.map((el: any, j: any) => {
                      let masterPath = '';
                      el.forEach((geo: number[][]) => {
                        let path = ' M';
                        geo.forEach((c: number[], k: number) => {
                          const point = projection([c[0], c[1]]) as [
                            number,
                            number,
                          ];
                          if (k !== geo.length - 1)
                            path = `${path}${point[0]} ${point[1]}L`;
                          else path = `${path}${point[0]} ${point[1]}`;
                        });
                        masterPath += path;
                      });
                      return (
                        <path
                          key={j}
                          d={masterPath}
                          stroke='#AAA'
                          strokeWidth={0.25}
                          fill={UNDPColorModule.graphNoData}
                        />
                      );
                    })
                  : d.geometry.coordinates.map((el: any, j: number) => {
                      let path = 'M';
                      el.forEach((c: number[], k: number) => {
                        const point = projection([c[0], c[1]]) as [
                          number,
                          number,
                        ];
                        if (k !== el.length - 1)
                          path = `${path}${point[0]} ${point[1]}L`;
                        else path = `${path}${point[0]} ${point[1]}`;
                      });
                      return (
                        <path
                          key={j}
                          d={path}
                          stroke='#AAA'
                          strokeWidth={0.25}
                          fill={UNDPColorModule.graphNoData}
                        />
                      );
                    })}
              </g>
            );
          })}
          {data.map((d, i: number) => {
            const index = (World as any).features.findIndex(
              (el: any) => d['Alpha-3 code'] === el.properties.ISO3,
            );
            const color =
              val !== undefined
                ? colorScale(
                    xIndicatorMetaData.IsCategorical ? Math.floor(val) : val,
                  )
                : UNDPColorModule.graphNoData;
            return (
              <g
                key={i}
                opacity={
                  selectedColor
                    ? selectedColor === color
                      ? 1
                      : 0.1
                    ? 1
                }
              >
                {index === -1 || d['Country or Area'] === 'Antarctica'
                  ? null
                  : (World as any).features[index].geometry.type ===
                    'MultiPolygon'
                  ? (World as any).features[index].geometry.coordinates.map(
                      (el: any, j: any) => {
                        let masterPath = '';
                        el.forEach((geo: number[][]) => {
                          let path = ' M';
                          geo.forEach((c: number[], k: number) => {
                            const point = projection([c[0], c[1]]) as [
                              number,
                              number,
                            ];
                            if (k !== geo.length - 1)
                              path = `${path}${point[0]} ${point[1]}L`;
                            else path = `${path}${point[0]} ${point[1]}`;
                          });
                          masterPath += path;
                        });
                        return (
                          <path
                            key={j}
                            d={masterPath}
                            stroke='#AAA'
                            strokeWidth={0.25}
                            fill={color}
                          />
                        );
                      },
                    )
                  : (World as any).features[index].geometry.coordinates.map(
                      (el: any, j: number) => {
                        let path = 'M';
                        el.forEach((c: number[], k: number) => {
                          const point = projection([c[0], c[1]]) as [
                            number,
                            number,
                          ];
                          if (k !== el.length - 1)
                            path = `${path}${point[0]} ${point[1]}L`;
                          else path = `${path}${point[0]} ${point[1]}`;
                        });
                        return (
                          <path
                            key={j}
                            d={path}
                            stroke='#AAA'
                            strokeWidth={0.25}
                            fill={color}
                          />
                        );
                      },
                    )}
              </g>
            );
          })}
          {hoverData
            ? (World as any).features
                .filter(
                  (d: any) =>
                    d.properties.ISO3 ===
                    data[
                      data.findIndex(
                        el => el['Country or Area'] === hoverData?.country,
                      )
                    ]['Alpha-3 code'],
                )
                .map((d: any, i: number) => (
                  <g
                    style={{ pointerEvents: 'none' }}
                    opacity={!selectedColor ? 1 : 0}
                    key={i}
                  >
                    {d.geometry.type === 'MultiPolygon'
                      ? d.geometry.coordinates.map((el: any, j: any) => {
                          let masterPath = '';
                          el.forEach((geo: number[][]) => {
                            let path = ' M';
                            geo.forEach((c: number[], k: number) => {
                              const point = projection([c[0], c[1]]) as [
                                number,
                                number,
                              ];
                              if (k !== geo.length - 1)
                                path = `${path}${point[0]} ${point[1]}L`;
                              else path = `${path}${point[0]} ${point[1]}`;
                            });
                            masterPath += path;
                          });
                          return (
                            <path
                              key={j}
                              d={masterPath}
                              stroke='#212121'
                              opacity={1}
                              strokeWidth={1}
                              fillOpacity={0}
                              fill={UNDPColorModule.graphNoData}
                            />
                          );
                        })
                      : d.geometry.coordinates.map((el: any, j: number) => {
                          let path = 'M';
                          el.forEach((c: number[], k: number) => {
                            const point = projection([c[0], c[1]]) as [
                              number,
                              number,
                            ];
                            if (k !== el.length - 1)
                              path = `${path}${point[0]} ${point[1]}L`;
                            else path = `${path}${point[0]} ${point[1]}`;
                          });
                          return (
                            <path
                              key={j}
                              d={path}
                              stroke='#212121'
                              opacity={1}
                              strokeWidth={1}
                              fillOpacity={0}
                              fill='none'
                            />
                          );
                        })}
                  </g>
                ))
            : null}
          {sizeIndicatorMetaData ? (
            <>
              {data.map((d, i) => {
                const sizeIndicatorIndex = d.indicators.findIndex(
                  el => sizeIndicatorMetaData.DataKey === el.indicator,
                );
                const sizeVal =
                  sizeIndicatorIndex === -1
                    ? undefined
                    : year !== -1 && !showMostRecentData
                    ? d.indicators[sizeIndicatorIndex].yearlyData[
                        d.indicators[sizeIndicatorIndex].yearlyData.findIndex(
                          el => el.year === year,
                        )
                      ]?.value
                    : d.indicators[sizeIndicatorIndex].yearlyData[
                        d.indicators[sizeIndicatorIndex].yearlyData.length - 1
                      ]?.value;
                const center = projection([
                  d['Longitude (average)'],
                  d['Latitude (average)'],
                ]) as [number, number];
                const indicatorIndex = d.indicators.findIndex(
                  el => xIndicatorMetaData.DataKey === el.indicator,
                );
                const val =
                  indicatorIndex === -1
                    ? undefined
                    : year !== -1 && !showMostRecentData
                    ? d.indicators[indicatorIndex].yearlyData[
                        d.indicators[indicatorIndex].yearlyData.findIndex(
                          el => el.year === year,
                        )
                      ]?.value
                    : d.indicators[indicatorIndex].yearlyData[
                        d.indicators[indicatorIndex].yearlyData.length - 1
                      ]?.value;
                const color =
                  val !== undefined
                    ? colorScale(
                        xIndicatorMetaData.IsCategorical
                          ? Math.floor(val)
                          : val,
                      )
                    : UNDPColorModule.graphNoData;

                const regionOpacity =
                  selectedRegions.length === 0 ||
                  selectedRegions.indexOf(d['Group 2']) !== -1;
                const incomeGroupOpacity =
                  selectedIncomeGroups.length === 0 ||
                  selectedIncomeGroups.indexOf(d['Income group']) !== -1;
                const countryOpacity =
                  selectedCountries.length === 0 ||
                  selectedCountries.indexOf(d['Country or Area']) !== -1;
                const countryGroupOpacity =
                  selectedCountryGroup === 'All'
                    ? true
                    : d[selectedCountryGroup];

                const rowData: HoverRowDataType[] = [
                  {
                    title: xAxisIndicator,
                    value: val === undefined ? 'NA' : val,
                    type: 'color',
                    year:
                      indicatorIndex === -1
                        ? undefined
                        : year === -1 || showMostRecentData
                        ? d.indicators[indicatorIndex].yearlyData[
                            d.indicators[indicatorIndex].yearlyData.length - 1
                          ]?.year
                        : year,
                    color,
                    prefix: xIndicatorMetaData?.LabelPrefix,
                    suffix: xIndicatorMetaData?.LabelSuffix,
                  },
                ];
                if (sizeIndicatorMetaData) {
                  rowData.push({
                    title: sizeIndicator,
                    value: sizeVal !== undefined ? sizeVal : 'NA',
                    type: 'size',
                    prefix: sizeIndicatorMetaData?.LabelPrefix,
                    suffix: sizeIndicatorMetaData?.LabelSuffix,
                    year:
                      sizeIndicatorIndex === -1
                        ? undefined
                        : year === -1 || showMostRecentData
                        ? d.indicators[sizeIndicatorIndex].yearlyData[
                            d.indicators[sizeIndicatorIndex].yearlyData.length -
                              1
                          ]?.year
                        : year,
                  });
                }
                return (
                  <circle
                    key={i}
                    onMouseEnter={event => {
                      setHoverData({
                        country: d['Country or Area'],
                        continent: d['Group 1'],
                        rows: rowData,
                        xPosition: event.clientX,
                        yPosition: event.clientY,
                      });
                    }}
                    onMouseMove={event => {
                      setHoverData({
                        country: d['Country or Area'],
                        continent: d['Group 1'],
                        rows: rowData,
                        xPosition: event.clientX,
                        yPosition: event.clientY,
                      });
                    }}
                    onMouseLeave={() => {
                      setHoverData(undefined);
                    }}
                    cx={center[0]}
                    cy={center[1]}
                    r={sizeVal !== undefined ? radiusScale(sizeVal) : 0}
                    stroke='#212121'
                    strokeWidth={1}
                    fill='none'
                    opacity={
                      !hoverData
                        ? selectedColor
                          ? selectedColor === color
                            ? 1
                            : 0.1
                          : regionOpacity &&
                            incomeGroupOpacity &&
                            countryOpacity &&
                            countryGroupOpacity
                          ? 1
                          : 0.1
                        : hoverData.country === d['Country or Area']
                        ? 1
                        : 0.1
                    }
                  />
                );
              })}
            </>
          ) : null}
        </g>
      </svg>
      <div
        style={{ position: 'sticky', bottom: '0px' }}
        className='bivariate-legend-container'
      >
        <div className='univariate-legend-el'>
          <div className='univariate-map-color-legend-element'>
            <div>
              <div className='univariate-map-legend-text'>
                {xIndicatorMetaData.IndicatorLabelTable}
              </div>
              <svg width='100%' viewBox='0 0 320 30'>
                <g>
                  {valueArray.map((d, i) => (
                    <g
                      key={i}
                      onMouseOver={() => {
                        setSelectedColor(colorArray[i]);
                      }}
                      onMouseLeave={() => {
                        setSelectedColor(undefined);
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      <rect
                        x={
                          xIndicatorMetaData.IsCategorical
                            ? (i * 320) / valueArray.length + 1
                            : (i * 320) / colorArray.length + 1
                        }
                        y={1}
                        width={
                          xIndicatorMetaData.IsCategorical
                            ? 320 / valueArray.length - 2
                            : 320 / colorArray.length - 2
                        }
                        height={8}
                        fill={colorArray[i]}
                        stroke={
                          selectedColor === colorArray[i]
                            ? '#212121'
                            : colorArray[i]
                        }
                      />
                      <text
                        x={
                          xIndicatorMetaData.IsCategorical
                            ? (i * 320) / valueArray.length +
                              160 / valueArray.length
                            : ((i + 1) * 320) / colorArray.length
                        }
                        y={25}
                        textAnchor='middle'
                        fontSize={12}
                        fill='#212121'
                      >
                        {Math.abs(d) < 1
                          ? d
                          : format('~s')(d).replace('G', 'B')}
                      </text>
                    </g>
                  ))}
                  {xIndicatorMetaData.IsCategorical ? null : (
                    <g>
                      <rect
                        onMouseOver={() => {
                          setSelectedColor(colorArray[valueArray.length]);
                        }}
                        onMouseLeave={() => {
                          setSelectedColor(undefined);
                        }}
                        x={(valueArray.length * 320) / colorArray.length + 1}
                        y={1}
                        width={320 / colorArray.length - 2}
                        height={8}
                        fill={colorArray[valueArray.length]}
                        stroke={
                          selectedColor === colorArray[valueArray.length]
                            ? '#212121'
                            : colorArray[valueArray.length]
                        }
                        strokeWidth={1}
                        style={{ cursor: 'pointer' }}
                      />
                    </g>
                  )}
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
