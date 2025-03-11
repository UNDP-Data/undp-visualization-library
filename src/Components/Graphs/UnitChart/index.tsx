import { useRef } from 'react';
import sum from 'lodash.sum';
import { H2, P } from '@undp-data/undp-design-system-react';
import { GraphFooter } from '../../Elements/GraphFooter';
import { GraphHeader } from '../../Elements/GraphHeader';
import { UNDPColorModule } from '../../ColorPalette';
import {
  UnitChartDataType,
  SourcesDataType,
  BackgroundStyleDataType,
} from '../../../Types';
import { numberFormattingFunction } from '../../../Utils/numberFormattingFunction';

interface Props {
  data: UnitChartDataType[];
  totalNoOfDots?: number;
  gridSize?: number;
  unitPadding?: number;
  size?: number;
  graphTitle?: string;
  sources?: SourcesDataType[];
  colors?: string[];
  graphDescription?: string;
  footNote?: string;
  backgroundColor?: string | boolean;
  padding?: string;
  graphID?: string;
  graphDownload?: boolean;
  dataDownload?: boolean;
  language?: 'ar' | 'he' | 'en';
  graphLegend?: boolean;
  showStrokeForWhiteDots?: boolean;
  note?: string;
  mode?: 'light' | 'dark';
  width?: number;
  height?: number;
  minHeight?: number;
  relativeHeight?: number;
  ariaLabel?: string;
  backgroundStyle?: BackgroundStyleDataType;
}

export function UnitChart(props: Props) {
  const {
    data,
    size = 200,
    graphTitle,
    sources,
    colors = UNDPColorModule.light.categoricalColors.colors,
    graphDescription,
    totalNoOfDots = 100,
    unitPadding = 3,
    gridSize = 10,
    footNote,
    padding,
    backgroundColor = false,
    graphID,
    graphDownload = false,
    language = 'en',
    graphLegend = true,
    showStrokeForWhiteDots = true,
    note,
    dataDownload = false,
    mode = 'light',
    width,
    height,
    minHeight = 0,
    relativeHeight,
    ariaLabel,
    backgroundStyle = {},
  } = props;
  const totalValue = sum(data.map(d => d.value));
  const graphParentDiv = useRef<HTMLDivElement>(null);
  const gridDimension = size / gridSize;
  const radius = (gridDimension - unitPadding * 2) / 2;
  if (radius <= 0) {
    console.error(
      'The size of single unit is less than or equal to zero. Check values for ((dimension / gridSize) - (padding * 2)) / 2 is not less than or equal to 0.',
    );
    return null;
  }

  const cellsData: { color: string }[] = [];
  data.forEach((item, index) => {
    const count = Math.round((item.value / totalValue) * totalNoOfDots);
    for (let i = 0; i < count; i += 1) {
      cellsData.push({
        color: colors[index],
      });
    }
  });
  return (
    <div
      className={mode || 'light'}
      dir={language === 'he' || language === 'ar' ? 'rtl' : undefined}
    >
      <div
        className={`${
          !backgroundColor
            ? 'bg-transparent '
            : backgroundColor === true
            ? 'bg-primary-gray-200 dark:bg-primary-gray-650 '
            : ''
        }ml-auto mr-auto flex flex-col ${
          width ? 'w-fit grow-0' : 'w-full grow'
        } h-inherit ${language || 'en'}`}
        style={{
          ...backgroundStyle,
          minHeight: 'inherit',
          ...(backgroundColor && backgroundColor !== true
            ? { backgroundColor }
            : {}),
        }}
        id={graphID}
        ref={graphParentDiv}
        aria-label={
          ariaLabel ||
          `${graphTitle ? `The graph shows ${graphTitle}. ` : ''}${
            graphDescription ? ` ${graphDescription}` : ''
          }`
        }
      >
        <div
          className='flex grow'
          style={{
            padding: backgroundColor ? padding || '1rem' : padding || 0,
          }}
        >
          <div className='flex flex-col gap-3 w-full grow'>
            {graphTitle || graphDescription || graphDownload ? (
              <GraphHeader
                graphTitle={graphTitle}
                graphDescription={graphDescription}
                width={width}
                graphDownload={
                  graphDownload ? graphParentDiv.current : undefined
                }
                dataDownload={
                  dataDownload &&
                  data.map(d => d.data).filter(d => d !== undefined).length > 0
                    ? data.map(d => d.data).filter(d => d !== undefined)
                    : null
                }
              />
            ) : null}
            {note ? (
              <H2
                marginBottom='2xs'
                className='text-primary-gray-700 dark:text-primary-gray-100 font-bold'
                style={{
                  width: width ? `${width}px` : '100%',
                }}
              >
                {note}
              </H2>
            ) : null}
            <div className='flex grow flex-col justify-between'>
              <div>
                {graphLegend ? (
                  <div
                    className='mb-4 leading-0'
                    style={{
                      width: width ? `${width}px` : '100%',
                    }}
                    aria-label='Color legend'
                  >
                    <div className='flex mb-0 flex-wrap gap-x-1 gap-y-4'>
                      {data.map((d, i) => (
                        <div className='flex gap-2 items-center' key={i}>
                          <div
                            className='w-3 h-3 rounded-full'
                            style={{
                              backgroundColor: colors[i],
                            }}
                          />
                          <P
                            marginBottom='none'
                            size='sm'
                            className='text-primary-gray-700 dark:text-primary-gray-100'
                          >
                            {d.label}:{' '}
                            <span className='font-bold'>
                              {numberFormattingFunction(d.value)}
                            </span>
                          </P>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
                <div aria-label='Graph area'>
                  <svg
                    width={`${width || size}px`}
                    height={`${Math.max(
                      minHeight,
                      height
                        ? relativeHeight && width
                          ? minHeight
                            ? width * relativeHeight > minHeight
                              ? width * relativeHeight
                              : minHeight
                            : width * relativeHeight
                          : height
                        : Math.floor((totalNoOfDots - 1) / gridSize) *
                            gridDimension +
                            gridDimension / 2 +
                            radius +
                            5,
                    )}px`}
                    direction='ltr'
                    viewBox={`0 0 ${width || size} ${Math.max(
                      minHeight,
                      height
                        ? relativeHeight && width
                          ? minHeight
                            ? width * relativeHeight > minHeight
                              ? width * relativeHeight
                              : minHeight
                            : width * relativeHeight
                          : height
                        : Math.floor((totalNoOfDots - 1) / gridSize) *
                            gridDimension +
                            gridDimension / 2 +
                            radius +
                            5,
                    )}`}
                  >
                    <g>
                      {cellsData.map((d, i) => (
                        <circle
                          key={i}
                          cx={
                            (i % gridSize) * gridDimension + gridDimension / 2
                          }
                          cy={
                            Math.floor(i / gridSize) * gridDimension +
                            gridDimension / 2
                          }
                          style={{
                            fill: d.color,
                            ...(!showStrokeForWhiteDots
                              ? { stroke: d.color }
                              : {}),
                            strokeWidth: 1,
                          }}
                          className={
                            (d.color.toLowerCase() === '#fff' ||
                              d.color.toLowerCase() === '#ffffff' ||
                              d.color.toLowerCase() === 'white') &&
                            showStrokeForWhiteDots
                              ? 'stroke-primary-gray-400 dark:stroke-primary-gray-500'
                              : ''
                          }
                          r={radius}
                        />
                      ))}
                    </g>
                  </svg>
                </div>
              </div>
              {sources || footNote ? (
                <GraphFooter
                  sources={sources}
                  footNote={footNote}
                  width={width}
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
