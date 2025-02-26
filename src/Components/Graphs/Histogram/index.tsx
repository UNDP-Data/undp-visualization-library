import { useState, useEffect } from 'react';
import { bin } from 'd3-array';
import {
  TreeMapDataType,
  ReferenceDataType,
  HistogramDataType,
  DonutChartDataType,
  SourcesDataType,
  BackgroundStyleDataType,
  CSSObject,
} from '../../../Types';
import { UNDPColorModule } from '../../ColorPalette';
import { CirclePackingGraph } from '../CirclePackingGraph';
import { TreeMapGraph } from '../TreeMapGraph';
import { VerticalBarGraph } from '../BarGraph/VerticalBarGraph/SimpleBarGraph';
import { DonutChart } from '../DonutChart';
import { HorizontalBarGraph } from '../BarGraph/HorizontalBarGraph/SimpleBarGraph';

interface Props {
  data: HistogramDataType[];
  color?: string[] | string;
  graphTitle?: string;
  graphDescription?: string;
  footNote?: string;
  width?: number;
  height?: number;
  sources?: SourcesDataType[];
  barPadding?: number;
  showValues?: boolean;
  showTicks?: boolean;
  leftMargin?: number;
  rightMargin?: number;
  backgroundColor?: string | boolean;
  padding?: string;
  topMargin?: number;
  bottomMargin?: number;
  relativeHeight?: number;
  showLabels?: boolean;
  maxValue?: number;
  tooltip?: string;
  onSeriesMouseOver?: (_d: any) => void;
  refValues?: ReferenceDataType[];
  graphID?: string;
  onSeriesMouseClick?: (_d: any) => void;
  graphDownload?: boolean;
  dataDownload?: boolean;
  numberOfBins?: number;
  truncateBy?: number;
  donutStrokeWidth?: number;
  sortData?: 'asc' | 'desc';
  barGraphLayout?: 'horizontal' | 'vertical';
  graphType?: 'circlePacking' | 'treeMap' | 'barGraph' | 'donutChart';
  rtl?: boolean;
  language?: 'ar' | 'he' | 'en';
  minHeight?: number;
  maxBarThickness?: number;
  mode?: 'light' | 'dark';
  ariaLabel?: string;
  backgroundStyle?: BackgroundStyleDataType;
  tooltipBackgroundStyle?: CSSObject;
  detailsOnClick?: string;
}

export function Histogram(props: Props) {
  const {
    data,
    graphTitle,
    sources,
    graphDescription,
    barPadding,
    showValues,
    showTicks,
    leftMargin,
    rightMargin,
    height,
    width,
    footNote,
    color,
    padding,
    backgroundColor,
    topMargin,
    bottomMargin,
    showLabels,
    relativeHeight,
    tooltip,
    onSeriesMouseOver,
    refValues,
    graphID,
    maxValue,
    onSeriesMouseClick,
    graphDownload,
    dataDownload,
    numberOfBins,
    truncateBy,
    graphType,
    barGraphLayout,
    donutStrokeWidth,
    sortData,
    rtl,
    language,
    minHeight,
    mode = 'light',
    maxBarThickness,
    ariaLabel,
    backgroundStyle,
    tooltipBackgroundStyle,
    detailsOnClick,
  } = props;

  const [dataFormatted, setDataFormatted] = useState<TreeMapDataType[]>([]);
  useEffect(() => {
    const bins = bin()
      .thresholds(numberOfBins || 10)
      .value((d: any) => d.value)(data as any);
    const dataUpdates = bins.map(d => ({
      label: `${d.x0}-${d.x1}`,
      size: d.length,
      data: {
        options: `${d.x0}-${d.x1}`,
        frequency: d.length,
      },
    }));
    setDataFormatted(dataUpdates);
  }, [data, numberOfBins]);
  if (dataFormatted.length === 0)
    return (
      <div
        style={{ width: `${width}px`, height: `${height}px`, margin: 'auto' }}
      >
        <div className='flex m-auto items-center justify-center p-0 leading-none text-base h-40'>
          <div className='undp-viz-loader' />
        </div>
      </div>
    );
  if (graphType === 'circlePacking')
    return (
      <CirclePackingGraph
        colors={color || UNDPColorModule[mode].graphMainColor}
        graphTitle={graphTitle}
        graphDescription={graphDescription}
        footNote={footNote}
        width={width}
        height={height}
        sources={sources}
        leftMargin={leftMargin}
        rightMargin={rightMargin}
        backgroundColor={backgroundColor}
        padding={padding}
        topMargin={topMargin}
        bottomMargin={bottomMargin}
        relativeHeight={relativeHeight}
        showLabels={showLabels}
        tooltip={tooltip}
        onSeriesMouseOver={onSeriesMouseOver}
        showColorScale={false}
        showValues={showValues}
        graphID={graphID}
        onSeriesMouseClick={onSeriesMouseClick}
        graphDownload={graphDownload}
        dataDownload={dataDownload}
        data={dataFormatted}
        rtl={rtl}
        language={language}
        minHeight={minHeight}
        mode={mode}
        ariaLabel={ariaLabel}
        backgroundStyle={backgroundStyle}
        tooltipBackgroundStyle={tooltipBackgroundStyle}
        detailsOnClick={detailsOnClick}
      />
    );
  if (graphType === 'treeMap')
    return (
      <TreeMapGraph
        colors={color || UNDPColorModule[mode].graphMainColor}
        graphTitle={graphTitle}
        graphDescription={graphDescription}
        footNote={footNote}
        width={width}
        height={height}
        sources={sources}
        leftMargin={leftMargin}
        rightMargin={rightMargin}
        backgroundColor={backgroundColor}
        padding={padding}
        topMargin={topMargin}
        bottomMargin={bottomMargin}
        relativeHeight={relativeHeight}
        showLabels={showLabels}
        tooltip={tooltip}
        onSeriesMouseOver={onSeriesMouseOver}
        showColorScale={false}
        showValues={showValues}
        graphID={graphID}
        onSeriesMouseClick={onSeriesMouseClick}
        graphDownload={graphDownload}
        dataDownload={dataDownload}
        data={dataFormatted}
        rtl={rtl}
        language={language}
        minHeight={minHeight}
        mode={mode}
        ariaLabel={ariaLabel}
        backgroundStyle={backgroundStyle}
        tooltipBackgroundStyle={tooltipBackgroundStyle}
        detailsOnClick={detailsOnClick}
      />
    );
  if (graphType === 'donutChart')
    return (
      <DonutChart
        colors={
          (color as string[] | undefined) ||
          UNDPColorModule[mode].categoricalColors.colors
        }
        graphTitle={graphTitle}
        graphDescription={graphDescription}
        footNote={footNote}
        radius={
          width && height
            ? width < height
              ? width
              : height
            : width || height || undefined
        }
        sources={sources}
        backgroundColor={backgroundColor}
        padding={padding}
        tooltip={tooltip}
        onSeriesMouseOver={onSeriesMouseOver}
        graphID={graphID}
        onSeriesMouseClick={onSeriesMouseClick}
        graphDownload={graphDownload}
        dataDownload={dataDownload}
        data={dataFormatted as DonutChartDataType[]}
        strokeWidth={donutStrokeWidth}
        graphLegend
        sortData={sortData}
        rtl={rtl}
        language={language}
        mode={mode}
        ariaLabel={ariaLabel}
        backgroundStyle={backgroundStyle}
        tooltipBackgroundStyle={tooltipBackgroundStyle}
        detailsOnClick={detailsOnClick}
      />
    );
  if (barGraphLayout === 'horizontal')
    return (
      <HorizontalBarGraph
        colors={color || UNDPColorModule[mode].graphMainColor}
        graphTitle={graphTitle}
        graphDescription={graphDescription}
        footNote={footNote}
        width={width}
        height={height}
        sources={sources}
        leftMargin={leftMargin}
        rightMargin={rightMargin}
        backgroundColor={backgroundColor}
        padding={padding}
        topMargin={topMargin}
        bottomMargin={bottomMargin}
        relativeHeight={relativeHeight}
        showLabels={showLabels}
        tooltip={tooltip}
        onSeriesMouseOver={onSeriesMouseOver}
        showColorScale={false}
        showValues={showValues}
        graphID={graphID}
        onSeriesMouseClick={onSeriesMouseClick}
        graphDownload={graphDownload}
        dataDownload={dataDownload}
        data={dataFormatted}
        barPadding={barPadding}
        refValues={refValues}
        truncateBy={truncateBy}
        maxValue={maxValue}
        showTicks={showTicks}
        sortData={sortData}
        rtl={rtl}
        language={language}
        minHeight={minHeight}
        mode={mode}
        maxBarThickness={maxBarThickness}
        ariaLabel={ariaLabel}
        backgroundStyle={backgroundStyle}
        tooltipBackgroundStyle={tooltipBackgroundStyle}
        detailsOnClick={detailsOnClick}
      />
    );
  return (
    <VerticalBarGraph
      colors={color || UNDPColorModule[mode].graphMainColor}
      graphTitle={graphTitle}
      graphDescription={graphDescription}
      footNote={footNote}
      width={width}
      height={height}
      sources={sources}
      leftMargin={leftMargin}
      rightMargin={rightMargin}
      backgroundColor={backgroundColor}
      padding={padding}
      topMargin={topMargin}
      bottomMargin={bottomMargin}
      relativeHeight={relativeHeight}
      showLabels={showLabels}
      tooltip={tooltip}
      onSeriesMouseOver={onSeriesMouseOver}
      showColorScale={false}
      showValues={showValues}
      graphID={graphID}
      onSeriesMouseClick={onSeriesMouseClick}
      graphDownload={graphDownload}
      dataDownload={dataDownload}
      data={dataFormatted}
      barPadding={barPadding}
      refValues={refValues}
      truncateBy={truncateBy}
      maxValue={maxValue}
      showTicks={showTicks}
      sortData={sortData}
      rtl={rtl}
      language={language}
      minHeight={minHeight}
      mode={mode}
      maxBarThickness={maxBarThickness}
      ariaLabel={ariaLabel}
      backgroundStyle={backgroundStyle}
      tooltipBackgroundStyle={tooltipBackgroundStyle}
      detailsOnClick={detailsOnClick}
    />
  );
}
