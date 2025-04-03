import {
  ReferenceDataType,
  SourcesDataType,
  Languages,
  BeeSwarmChartDataType,
  StyleObject,
  ClassNameObject,
} from '@/Types';
import { HorizontalBeeSwarmChart } from './Horizontal';
import { VerticalBeeSwarmChart } from './Vertical';

interface Props {
  // Data
  data: BeeSwarmChartDataType[];

  // Titles, Labels, and Sources
  graphTitle?: string;
  graphDescription?: string;
  footNote?: string;
  sources?: SourcesDataType[];
  ariaLabel?: string;

  // Colors and Styling
  colors?: string[];
  colorDomain?: string[];
  colorLegendTitle?: string;
  backgroundColor?: string | boolean;
  styles?: StyleObject;
  classNames?: ClassNameObject;

  // Size and Spacing
  width?: number;
  height?: number;
  minHeight?: number;
  relativeHeight?: number;
  padding?: string;
  leftMargin?: number;
  rightMargin?: number;
  topMargin?: number;
  bottomMargin?: number;

  // Values and Ticks
  refValues?: ReferenceDataType[];
  noOfTicks?: number;

  // Graph Parameters
  showLabels?: boolean;
  showTicks?: boolean;
  showColorScale?: boolean;
  showNAColor?: boolean;
  radius?: number;
  maxRadiusValue?: number;
  maxPositionValue?: number;
  minPositionValue?: number;
  highlightedDataPoints?: (string | number)[];
  graphDownload?: boolean;
  dataDownload?: boolean;
  resetSelectionOnDoubleClick?: boolean;

  // Interactions and Callbacks
  tooltip?: string;
  detailsOnClick?: string;
  onSeriesMouseOver?: (_d: any) => void;
  onSeriesMouseClick?: (_d: any) => void;

  // Configuration and Options
  language?: Languages;
  mode?: 'light' | 'dark';
  orientation?: 'vertical' | 'horizontal';
  graphID?: string;
}

export function BeeSwarmChart(props: Props) {
  const {
    data,
    graphTitle,
    backgroundColor,
    topMargin,
    bottomMargin,
    leftMargin,
    rightMargin,
    showLabels,
    showTicks,
    colors,
    sources,
    graphDescription,
    height,
    width,
    footNote,
    colorDomain,
    colorLegendTitle,
    padding,
    relativeHeight,
    tooltip,
    onSeriesMouseOver,
    refValues,
    showColorScale,
    graphID,
    radius,
    maxRadiusValue,
    maxPositionValue,
    minPositionValue,
    highlightedDataPoints,
    onSeriesMouseClick,
    graphDownload,
    dataDownload,
    language,
    showNAColor,
    minHeight,
    mode,
    ariaLabel,
    resetSelectionOnDoubleClick,
    detailsOnClick,
    noOfTicks,
    orientation = 'vertical',
    styles,
    classNames,
  } = props;

  if (orientation === 'vertical')
    return (
      <VerticalBeeSwarmChart
        data={data}
        graphTitle={graphTitle}
        backgroundColor={backgroundColor}
        topMargin={topMargin}
        bottomMargin={bottomMargin}
        leftMargin={leftMargin}
        rightMargin={rightMargin}
        showLabels={showLabels}
        showTicks={showTicks}
        colors={colors}
        sources={sources}
        graphDescription={graphDescription}
        height={height}
        width={width}
        footNote={footNote}
        colorDomain={colorDomain}
        colorLegendTitle={colorLegendTitle}
        padding={padding}
        relativeHeight={relativeHeight}
        tooltip={tooltip}
        onSeriesMouseOver={onSeriesMouseOver}
        refValues={refValues}
        showColorScale={showColorScale}
        graphID={graphID}
        radius={radius}
        maxRadiusValue={maxRadiusValue}
        maxPositionValue={maxPositionValue}
        minPositionValue={minPositionValue}
        highlightedDataPoints={highlightedDataPoints}
        onSeriesMouseClick={onSeriesMouseClick}
        graphDownload={graphDownload}
        dataDownload={dataDownload}
        language={language}
        showNAColor={showNAColor}
        minHeight={minHeight}
        mode={mode}
        ariaLabel={ariaLabel}
        resetSelectionOnDoubleClick={resetSelectionOnDoubleClick}
        styles={styles}
        detailsOnClick={detailsOnClick}
        classNames={classNames}
        noOfTicks={noOfTicks}
      />
    );
  return (
    <HorizontalBeeSwarmChart
      data={data}
      graphTitle={graphTitle}
      backgroundColor={backgroundColor}
      topMargin={topMargin}
      bottomMargin={bottomMargin}
      leftMargin={leftMargin}
      rightMargin={rightMargin}
      showLabels={showLabels}
      showTicks={showTicks}
      colors={colors}
      sources={sources}
      graphDescription={graphDescription}
      height={height}
      width={width}
      footNote={footNote}
      colorDomain={colorDomain}
      colorLegendTitle={colorLegendTitle}
      padding={padding}
      relativeHeight={relativeHeight}
      tooltip={tooltip}
      onSeriesMouseOver={onSeriesMouseOver}
      refValues={refValues}
      showColorScale={showColorScale}
      graphID={graphID}
      radius={radius}
      maxRadiusValue={maxRadiusValue}
      maxPositionValue={maxPositionValue}
      minPositionValue={minPositionValue}
      highlightedDataPoints={highlightedDataPoints}
      onSeriesMouseClick={onSeriesMouseClick}
      graphDownload={graphDownload}
      dataDownload={dataDownload}
      language={language}
      showNAColor={showNAColor}
      minHeight={minHeight}
      mode={mode}
      ariaLabel={ariaLabel}
      resetSelectionOnDoubleClick={resetSelectionOnDoubleClick}
      styles={styles}
      detailsOnClick={detailsOnClick}
      classNames={classNames}
      noOfTicks={noOfTicks}
    />
  );
}
