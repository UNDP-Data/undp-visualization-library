import { useState, useRef, useEffect } from 'react';
import uniqBy from 'lodash.uniqby';
import { ascending, sort } from 'd3-array';
import { format, parse } from 'date-fns';
import { SliderUI } from '@undp-data/undp-design-system-react';
import { Graph } from './Graph';
import { GraphFooter } from '@/Components/Elements/GraphFooter';
import { GraphHeader } from '@/Components/Elements/GraphHeader';
import {
  DotDensityMapWithDateDataType,
  Languages,
  SourcesDataType,
  StyleObject,
  ClassNameObject,
} from '@/Types';
import WorldMapData from '../../WorldMapData/data.json';
import { UNDPColorModule } from '@/Components/ColorPalette';
import { Pause, Play } from '@/Components/Icons';
import { fetchAndParseJSON } from '@/Utils/fetchAndParseData';
import { checkIfNullOrUndefined } from '@/Utils/checkIfNullOrUndefined';

interface Props {
  // Data
  /** Array of data objects */
  data: DotDensityMapWithDateDataType[];

  // Titles, Labels, and Sources
  /** Title of the graph */
  graphTitle?: string;
  /** Description of the graph */
  graphDescription?: string;
  /** Footnote for the graph */
  footNote?: string;
  /** Source data for the graph */
  sources?: SourcesDataType[];
  /** Accessibility label */
  ariaLabel?: string;

  // Colors and Styling
  /** Color or array of colors for the circle */
  colors?: string | string[];
  /** Domain of colors for the graph */
  colorDomain: string[];
  /** Title for the color legend */
  colorLegendTitle?: string;
  /** Color for the areas where data is no available */
  mapNoDataColor?: string;
  /** Background color of the graph */
  backgroundColor?: string | boolean;
  /** Custom styles for the graph. Each object should be a valid React CSS style object. */
  styles?: StyleObject;
  /** Custom class names */
  classNames?: ClassNameObject;

  // Size and Spacing
  /** Width of the graph */
  width?: number;
  /** Height of the graph */
  height?: number;
  /** Minimum height of the graph */
  minHeight?: number;
  /** Relative height scaling factor. This overwrites the height props */
  relativeHeight?: number;
  /** Padding around the graph */
  padding?: string;

  // Graph Parameters
  /** Maximum radius of the circle */
  radius?: number;
  /** Map data as an object in geoJson format */
  mapData?: any;
  /** Scale of the map */
  scale?: number;
  /** Center point of the map */
  centerPoint?: [number, number];
  /** Stroke width of the regions in the map */
  mapBorderWidth?: number;
  /** Stroke color of the regions in the map */
  mapBorderColor?: string;
  /** Toggle if the map is a world map */
  isWorldMap?: boolean;
  /** Extend of the allowed zoom in the map */
  zoomScaleExtend?: [number, number];
  /** Extend of the allowed panning in the map */
  zoomTranslateExtend?: [[number, number], [number, number]];
  /** Toggle visibility of labels */
  showLabels?: boolean;
  /** Data points to highlight. Use the label value from data to highlight the data point */
  highlightedDataPoints?: (string | number)[];
  /** Toggle visibility of color scale. This is only applicable if the data props hae color parameter */
  showColorScale?: boolean;
  /** Toggles the visibility of Antarctica in the default map. Only applicable for the default map. */
  showAntarctica?: boolean;
  /** Enable graph download option as png */
  graphDownload?: boolean;
  /** Enable data download option as a csv */
  dataDownload?: boolean;
  /** Reset selection on double-click. Only applicable when used in a dashboard context with filters. */
  resetSelectionOnDoubleClick?: boolean;

  // Interactions and Callbacks
  /** Tooltip content. This uses the handlebar template to display the data */
  tooltip?: string;
  /** Details displayed on the modal when user clicks of a data point */
  detailsOnClick?: string;
  /** Callback for mouse over event */
  onSeriesMouseOver?: (_d: any) => void;
  /** Callback for mouse click even */
  onSeriesMouseClick?: (_d: any) => void;

  // Slider features
  /** Format of the date in the data object  */
  dateFormat?: string;
  /** Toggles if only the currently active date should be shown on the timeline. */
  showOnlyActiveDate?: boolean;
  /** Toggles if the animation should start automatically. */
  autoPlay?: boolean;

  // Configuration and Options
  /** Language setting  */
  language?: Languages;
  /** Theme mode */
  mode?: 'light' | 'dark';
  /** Unique ID for the graph */
  graphID?: string;
}

export function AnimatedDotDensityMap(props: Props) {
  const {
    data,
    mapData,
    graphTitle,
    colors,
    sources,
    graphDescription,
    height,
    width,
    footNote,
    colorLegendTitle,
    colorDomain,
    radius = 5,
    scale = 190,
    centerPoint = [10, 10],
    padding,
    mapBorderWidth = 0.5,
    mapNoDataColor = UNDPColorModule.light.graphNoData,
    backgroundColor = false,
    showLabels = false,
    mapBorderColor = UNDPColorModule.light.grays['gray-500'],
    tooltip,
    relativeHeight,
    onSeriesMouseOver,
    isWorldMap = true,
    showColorScale = true,
    zoomScaleExtend = [0.8, 6],
    zoomTranslateExtend,
    graphID,
    dateFormat = 'yyyy',
    showOnlyActiveDate = false,
    autoPlay = false,
    highlightedDataPoints = [],
    onSeriesMouseClick,
    graphDownload = false,
    dataDownload = false,
    showAntarctica = false,
    language = 'en',
    minHeight = 0,
    mode = 'light',
    ariaLabel,
    resetSelectionOnDoubleClick = true,
    detailsOnClick,
    styles,
    classNames,
  } = props;

  const [svgWidth, setSvgWidth] = useState(0);
  const [svgHeight, setSvgHeight] = useState(0);
  const [mapShape, setMapShape] = useState<any>(undefined);

  const graphDiv = useRef<HTMLDivElement>(null);
  const graphParentDiv = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      setSvgWidth(width || entries[0].target.clientWidth || 760);
      setSvgHeight(height || entries[0].target.clientHeight || 480);
    });
    if (graphDiv.current) {
      setSvgHeight(graphDiv.current.clientHeight || 480);
      setSvgWidth(graphDiv.current.clientWidth || 760);
      if (!width) resizeObserver.observe(graphDiv.current);
    }
    return () => resizeObserver.disconnect();
  }, [width, height]);

  const [play, setPlay] = useState(autoPlay);
  const uniqDatesSorted = sort(
    uniqBy(data, d => d.date).map(d =>
      parse(`${d.date}`, dateFormat, new Date()).getTime(),
    ),
    (a, b) => ascending(a, b),
  );
  const [index, setIndex] = useState(autoPlay ? 0 : uniqDatesSorted.length - 1);

  const markObj: any = {};

  uniqDatesSorted.forEach((d, i) => {
    markObj[`${d}`] = {
      style: {
        color: i === index ? '#232E3D' : '#A9B1B7', // Active text color vs. inactive
        fontWeight: i === index ? 'bold' : 'normal', // Active font weight vs. inactive
        display: i === index || !showOnlyActiveDate ? 'inline' : 'none', // Active font weight vs. inactive
      },
      label: format(new Date(d), dateFormat),
    };
  });
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(i => (i < uniqDatesSorted.length - 1 ? i + 1 : 0));
    }, 2000);
    if (!play) clearInterval(interval);
    return () => clearInterval(interval);
  }, [uniqDatesSorted, play]);
  useEffect(() => {
    if (typeof mapData === 'string') {
      const fetchData = fetchAndParseJSON(mapData);
      fetchData.then(d => {
        setMapShape(d);
      });
    } else {
      setMapShape(mapData || WorldMapData);
    }
  }, [mapData]);

  return (
    <div
      className={`${mode || 'light'} flex  ${
        width ? 'w-fit grow-0' : 'w-full grow'
      }`}
      dir={language === 'he' || language === 'ar' ? 'rtl' : undefined}
    >
      <div
        className={`${
          !backgroundColor
            ? 'bg-transparent '
            : backgroundColor === true
            ? 'bg-primary-gray-200 dark:bg-primary-gray-650 '
            : ''
        }ml-auto mr-auto flex flex-col grow h-inherit ${language || 'en'}`}
        style={{
          ...(styles?.graphBackground || {}),
          ...(backgroundColor && backgroundColor !== true
            ? { backgroundColor }
            : {}),
        }}
        id={graphID}
        ref={graphParentDiv}
        aria-label={
          ariaLabel ||
          `${
            graphTitle ? `The graph shows ${graphTitle}. ` : ''
          }This is an animated dot density map showing the distribution of a variable across a region or world, with each dot representing a data point and changes over time.${
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
          <div className='flex flex-col w-full gap-4 grow justify-between'>
            {graphTitle || graphDescription || graphDownload || dataDownload ? (
              <GraphHeader
                styles={{
                  title: styles?.title,
                  description: styles?.description,
                }}
                classNames={{
                  title: classNames?.title,
                  description: classNames?.description,
                }}
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
            <div className='flex gap-6 items-center' dir='ltr'>
              <button
                type='button'
                onClick={() => {
                  setPlay(!play);
                }}
                className='p-0 border-0 cursor-pointer bg-transparent'
                aria-label={
                  play ? 'Click to pause animation' : 'Click to play animation'
                }
              >
                {play ? <Pause /> : <Play />}
              </button>
              <SliderUI
                min={uniqDatesSorted[0]}
                max={uniqDatesSorted[uniqDatesSorted.length - 1]}
                marks={markObj}
                step={null}
                defaultValue={uniqDatesSorted[uniqDatesSorted.length - 1]}
                value={uniqDatesSorted[index]}
                onChangeComplete={nextValue => {
                  setIndex(uniqDatesSorted.indexOf(nextValue as number));
                }}
                onChange={nextValue => {
                  setIndex(uniqDatesSorted.indexOf(nextValue as number));
                }}
                aria-label='Time slider. Use arrow keys to adjust selected time period.'
              />
            </div>
            <div
              className='flex flex-col grow justify-center leading-0'
              ref={graphDiv}
              aria-label='Map area'
            >
              {(width || svgWidth) && (height || svgHeight) && mapShape ? (
                <Graph
                  data={data}
                  mapData={mapShape}
                  colorDomain={
                    data.filter(el => el.color).length === 0
                      ? []
                      : colorDomain ||
                        (uniqBy(
                          data.filter(el => !checkIfNullOrUndefined(el.color)),
                          'color',
                        ).map(d => `${d.color}`) as string[])
                  }
                  width={width || svgWidth}
                  height={Math.max(
                    minHeight,
                    height ||
                      (relativeHeight
                        ? minHeight
                          ? (width || svgWidth) * relativeHeight > minHeight
                            ? (width || svgWidth) * relativeHeight
                            : minHeight
                          : (width || svgWidth) * relativeHeight
                        : svgHeight),
                  )}
                  scale={scale}
                  centerPoint={centerPoint}
                  colors={
                    data.filter(el => el.color).length === 0
                      ? colors
                        ? [colors as string]
                        : [UNDPColorModule[mode].primaryColors['blue-600']]
                      : (colors as string[] | undefined) ||
                        UNDPColorModule[mode].categoricalColors.colors
                  }
                  colorLegendTitle={colorLegendTitle}
                  radius={radius}
                  mapBorderWidth={mapBorderWidth}
                  mapNoDataColor={mapNoDataColor}
                  mapBorderColor={mapBorderColor}
                  tooltip={tooltip}
                  onSeriesMouseOver={onSeriesMouseOver}
                  showLabels={showLabels}
                  isWorldMap={isWorldMap}
                  showColorScale={showColorScale}
                  zoomScaleExtend={zoomScaleExtend}
                  zoomTranslateExtend={zoomTranslateExtend}
                  onSeriesMouseClick={onSeriesMouseClick}
                  highlightedDataPoints={highlightedDataPoints}
                  showAntarctica={showAntarctica}
                  dateFormat={dateFormat}
                  indx={index}
                  resetSelectionOnDoubleClick={resetSelectionOnDoubleClick}
                  styles={styles}
                  classNames={classNames}
                  detailsOnClick={detailsOnClick}
                />
              ) : null}
            </div>
            {sources || footNote ? (
              <GraphFooter
                styles={{ footnote: styles?.footnote, source: styles?.source }}
                classNames={{
                  footnote: classNames?.footnote,
                  source: classNames?.source,
                }}
                sources={sources}
                footNote={footNote}
                width={width}
              />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
