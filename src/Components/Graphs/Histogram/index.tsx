import { useState, useEffect } from 'react';
import { bin } from 'd3-array';
import {
  TreeMapDataType,
  ReferenceDataType,
  HistogramDataType,
  DonutChartDataType,
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
  sourceLink?: string;
  width?: number;
  height?: number;
  source?: string;
  barPadding?: number;
  showBarValue?: boolean;
  showTicks?: boolean;
  leftMargin?: number;
  rightMargin?: number;
  backgroundColor?: string | boolean;
  padding?: string;
  topMargin?: number;
  bottomMargin?: number;
  relativeHeight?: number;
  showBarLabel?: boolean;
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
}

export function Histogram(props: Props) {
  const {
    data,
    graphTitle,
    source,
    graphDescription,
    sourceLink,
    barPadding,
    showBarValue,
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
    showBarLabel,
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
        <div
          style={{
            display: 'flex',
            margin: 'auto',
            alignItems: 'center',
            justifyContent: 'center',
            height: '10rem',
            fontSize: '1rem',
            lineHeight: 1.4,
            padding: 0,
          }}
        >
          <div className='undp-viz-loader' />
        </div>
      </div>
    );
  if (graphType === 'circlePacking')
    return (
      <CirclePackingGraph
        colors={color || UNDPColorModule.graphMainColor}
        graphTitle={graphTitle}
        graphDescription={graphDescription}
        footNote={footNote}
        sourceLink={sourceLink}
        width={width}
        height={height}
        source={source}
        leftMargin={leftMargin}
        rightMargin={rightMargin}
        backgroundColor={backgroundColor}
        padding={padding}
        topMargin={topMargin}
        bottomMargin={bottomMargin}
        relativeHeight={relativeHeight}
        showLabel={showBarLabel}
        tooltip={tooltip}
        onSeriesMouseOver={onSeriesMouseOver}
        showColorScale={false}
        showValue={showBarValue}
        graphID={graphID}
        onSeriesMouseClick={onSeriesMouseClick}
        graphDownload={graphDownload}
        dataDownload={dataDownload}
        data={dataFormatted}
        rtl={rtl}
        language={language}
      />
    );
  if (graphType === 'treeMap')
    return (
      <TreeMapGraph
        colors={color || UNDPColorModule.graphMainColor}
        graphTitle={graphTitle}
        graphDescription={graphDescription}
        footNote={footNote}
        sourceLink={sourceLink}
        width={width}
        height={height}
        source={source}
        leftMargin={leftMargin}
        rightMargin={rightMargin}
        backgroundColor={backgroundColor}
        padding={padding}
        topMargin={topMargin}
        bottomMargin={bottomMargin}
        relativeHeight={relativeHeight}
        showLabel={showBarLabel}
        tooltip={tooltip}
        onSeriesMouseOver={onSeriesMouseOver}
        showColorScale={false}
        showValue={showBarValue}
        graphID={graphID}
        onSeriesMouseClick={onSeriesMouseClick}
        graphDownload={graphDownload}
        dataDownload={dataDownload}
        data={dataFormatted}
        rtl={rtl}
        language={language}
      />
    );
  if (graphType === 'donutChart')
    return (
      <DonutChart
        colors={
          (color as string[] | undefined) ||
          UNDPColorModule.categoricalColors.colors
        }
        graphTitle={graphTitle}
        graphDescription={graphDescription}
        footNote={footNote}
        sourceLink={sourceLink}
        radius={
          width && height
            ? width < height
              ? width
              : height
            : width || height || undefined
        }
        source={source}
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
      />
    );
  if (barGraphLayout === 'horizontal')
    return (
      <HorizontalBarGraph
        colors={color || UNDPColorModule.graphMainColor}
        graphTitle={graphTitle}
        graphDescription={graphDescription}
        footNote={footNote}
        sourceLink={sourceLink}
        width={width}
        height={height}
        source={source}
        leftMargin={leftMargin}
        rightMargin={rightMargin}
        backgroundColor={backgroundColor}
        padding={padding}
        topMargin={topMargin}
        bottomMargin={bottomMargin}
        relativeHeight={relativeHeight}
        showBarLabel={showBarLabel}
        tooltip={tooltip}
        onSeriesMouseOver={onSeriesMouseOver}
        showColorScale={false}
        showBarValue={showBarValue}
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
      />
    );
  return (
    <VerticalBarGraph
      colors={color || UNDPColorModule.graphMainColor}
      graphTitle={graphTitle}
      graphDescription={graphDescription}
      footNote={footNote}
      sourceLink={sourceLink}
      width={width}
      height={height}
      source={source}
      leftMargin={leftMargin}
      rightMargin={rightMargin}
      backgroundColor={backgroundColor}
      padding={padding}
      topMargin={topMargin}
      bottomMargin={bottomMargin}
      relativeHeight={relativeHeight}
      showBarLabel={showBarLabel}
      tooltip={tooltip}
      onSeriesMouseOver={onSeriesMouseOver}
      showColorScale={false}
      showBarValue={showBarValue}
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
    />
  );
}
