import {
  SourcesDataType,
  Languages,
  DumbbellChartDataType,
  StyleObject,
  ClassNameObject,
} from '../../../Types';
import { HorizontalDumbbellChart } from './Horizontal/Simple';
import { VerticalDumbbellChart } from './Vertical/Simple';

interface Props {
  data: DumbbellChartDataType[];
  colors?: string[];
  graphTitle?: string;
  graphDescription?: string;
  footNote?: string;
  width?: number;
  height?: number;
  sources?: SourcesDataType[];
  barPadding?: number;
  showTicks?: boolean;
  leftMargin?: number;
  rightMargin?: number;
  topMargin?: number;
  bottomMargin?: number;
  truncateBy?: number;
  colorDomain: string[];
  colorLegendTitle?: string;
  backgroundColor?: string | boolean;
  padding?: string;
  radius?: number;
  relativeHeight?: number;
  showValues?: boolean;
  showLabels?: boolean;
  tooltip?: string;
  onSeriesMouseOver?: (_d: any) => void;
  graphID?: string;
  maxPositionValue?: number;
  minPositionValue?: number;
  onSeriesMouseClick?: (_d: any) => void;
  graphDownload?: boolean;
  dataDownload?: boolean;
  suffix?: string;
  prefix?: string;
  sortParameter?: number | 'diff';
  arrowConnector?: boolean;
  connectorStrokeWidth?: number;
  language?: Languages;
  minHeight?: number;
  mode?: 'light' | 'dark';
  maxBarThickness?: number;
  maxNumberOfBars?: number;
  minBarThickness?: number;
  ariaLabel?: string;
  resetSelectionOnDoubleClick?: boolean;
  detailsOnClick?: string;
  barAxisTitle?: string;
  noOfTicks?: number;
  valueColor?: string;
  orientation?: 'vertical' | 'horizontal';
  styles?: StyleObject;
  classNames?: ClassNameObject;
}

export function DumbbellChart(props: Props) {
  const {
    data,
    graphTitle,
    colors,
    sources,
    graphDescription,
    barPadding,
    showTicks,
    leftMargin,
    rightMargin,
    topMargin,
    bottomMargin,
    truncateBy,
    height,
    width,
    footNote,
    colorDomain,
    colorLegendTitle,
    padding,
    backgroundColor,
    radius,
    tooltip,
    showLabels,
    relativeHeight,
    onSeriesMouseOver,
    graphID,
    suffix,
    prefix,
    maxPositionValue,
    minPositionValue,
    onSeriesMouseClick,
    graphDownload,
    dataDownload,
    showValues,
    sortParameter,
    arrowConnector,
    connectorStrokeWidth,
    language,
    minHeight,
    mode,
    maxBarThickness,
    maxNumberOfBars,
    minBarThickness,
    ariaLabel,
    resetSelectionOnDoubleClick,
    detailsOnClick,
    barAxisTitle,
    noOfTicks,
    valueColor,
    orientation = 'vertical',
    styles,
    classNames,
  } = props;

  if (orientation === 'vertical')
    return (
      <VerticalDumbbellChart
        data={data}
        graphTitle={graphTitle}
        colors={colors}
        sources={sources}
        graphDescription={graphDescription}
        barPadding={barPadding}
        showTicks={showTicks}
        leftMargin={leftMargin}
        rightMargin={rightMargin}
        topMargin={topMargin}
        bottomMargin={bottomMargin}
        truncateBy={truncateBy}
        height={height}
        width={width}
        footNote={footNote}
        colorDomain={colorDomain}
        colorLegendTitle={colorLegendTitle}
        padding={padding}
        backgroundColor={backgroundColor}
        radius={radius}
        tooltip={tooltip}
        showLabels={showLabels}
        relativeHeight={relativeHeight}
        onSeriesMouseOver={onSeriesMouseOver}
        graphID={graphID}
        suffix={suffix}
        prefix={prefix}
        maxPositionValue={maxPositionValue}
        minPositionValue={minPositionValue}
        onSeriesMouseClick={onSeriesMouseClick}
        graphDownload={graphDownload}
        dataDownload={dataDownload}
        showValues={showValues}
        sortParameter={sortParameter}
        arrowConnector={arrowConnector}
        connectorStrokeWidth={connectorStrokeWidth}
        language={language}
        minHeight={minHeight}
        mode={mode}
        maxBarThickness={maxBarThickness}
        maxNumberOfBars={maxNumberOfBars}
        minBarThickness={minBarThickness}
        ariaLabel={ariaLabel}
        resetSelectionOnDoubleClick={resetSelectionOnDoubleClick}
        styles={styles}
        detailsOnClick={detailsOnClick}
        barAxisTitle={barAxisTitle}
        noOfTicks={noOfTicks}
        valueColor={valueColor}
        classNames={classNames}
      />
    );
  return (
    <HorizontalDumbbellChart
      data={data}
      graphTitle={graphTitle}
      colors={colors}
      sources={sources}
      graphDescription={graphDescription}
      barPadding={barPadding}
      showTicks={showTicks}
      leftMargin={leftMargin}
      rightMargin={rightMargin}
      topMargin={topMargin}
      bottomMargin={bottomMargin}
      truncateBy={truncateBy}
      height={height}
      width={width}
      footNote={footNote}
      colorDomain={colorDomain}
      colorLegendTitle={colorLegendTitle}
      padding={padding}
      backgroundColor={backgroundColor}
      radius={radius}
      tooltip={tooltip}
      showLabels={showLabels}
      relativeHeight={relativeHeight}
      onSeriesMouseOver={onSeriesMouseOver}
      graphID={graphID}
      suffix={suffix}
      prefix={prefix}
      maxPositionValue={maxPositionValue}
      minPositionValue={minPositionValue}
      onSeriesMouseClick={onSeriesMouseClick}
      graphDownload={graphDownload}
      dataDownload={dataDownload}
      showValues={showValues}
      sortParameter={sortParameter}
      arrowConnector={arrowConnector}
      connectorStrokeWidth={connectorStrokeWidth}
      language={language}
      minHeight={minHeight}
      mode={mode}
      maxBarThickness={maxBarThickness}
      maxNumberOfBars={maxNumberOfBars}
      minBarThickness={minBarThickness}
      ariaLabel={ariaLabel}
      resetSelectionOnDoubleClick={resetSelectionOnDoubleClick}
      styles={styles}
      detailsOnClick={detailsOnClick}
      barAxisTitle={barAxisTitle}
      noOfTicks={noOfTicks}
      valueColor={valueColor}
      classNames={classNames}
    />
  );
}
