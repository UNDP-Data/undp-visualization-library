import {
  SourcesDataType,
  Languages,
  StripChartDataType,
  StyleObject, ClassNameObject,
} from '@/Types';
import { HorizontalStripChart } from './Horizontal';
import { VerticalStripChart } from './Vertical';

interface Props {
  data: StripChartDataType[];
  graphTitle?: string;
  graphDescription?: string;
  footNote?: string;
  width?: number;
  height?: number;
  sources?: SourcesDataType[];
  colors?: string | string[];
  colorDomain?: string[];
  colorLegendTitle?: string;
  radius?: number;
  backgroundColor?: string | boolean;
  padding?: string;
  leftMargin?: number;
  rightMargin?: number;
  topMargin?: number;
  bottomMargin?: number;
  relativeHeight?: number;
  tooltip?: string;
  onSeriesMouseOver?: (_d: any) => void;
  highlightedDataPoints?: (string | number)[];
  showColorScale?: boolean;
  graphID?: string;
  maxValue?: number;
  minValue?: number;
  onSeriesMouseClick?: (_d: any) => void;
  showAxis?: boolean;
  graphDownload?: boolean;
  dataDownload?: boolean;
  prefix?: string;
  suffix?: string;
  stripType?: 'strip' | 'dot';
  language?: Languages;
  highlightColor?: string;
  dotOpacity?: number;
  showNAColor?: boolean;
  minHeight?: number;
  mode?: 'light' | 'dark';
  ariaLabel?: string;
  resetSelectionOnDoubleClick?: boolean;
  detailsOnClick?: string;
  orientation?: 'vertical' | 'horizontal';
  styles?: StyleObject; classNames?:  ClassNameObject;
}

export function StripChart(props: Props) {
  const {
    data,
    graphTitle,
    colors,
    sources,
    graphDescription,
    height,
    width,
    footNote,
    colorDomain,
    colorLegendTitle,
    radius,
    padding,
    backgroundColor,
    leftMargin,
    rightMargin,
    topMargin,
    bottomMargin,
    tooltip,
    relativeHeight,
    onSeriesMouseOver,
    showColorScale,
    highlightedDataPoints,
    graphID,
    minValue,
    maxValue,
    onSeriesMouseClick,
    showAxis,
    graphDownload,
    dataDownload,
    prefix,
    suffix,
    stripType,
    language,
    highlightColor,
    dotOpacity,
    showNAColor,
    minHeight,
    mode,
    ariaLabel,
    resetSelectionOnDoubleClick,
    detailsOnClick,
    orientation = 'vertical',
    styles, classNames,
  } = props;

  if (orientation === 'vertical')
    return (
      <VerticalStripChart
        data={data}
        graphTitle={graphTitle}
        colors={colors}
        sources={sources}
        graphDescription={graphDescription}
        height={height}
        width={width}
        footNote={footNote}
        colorDomain={colorDomain}
        colorLegendTitle={colorLegendTitle}
        radius={radius}
        padding={padding}
        backgroundColor={backgroundColor}
        leftMargin={leftMargin}
        rightMargin={rightMargin}
        topMargin={topMargin}
        bottomMargin={bottomMargin}
        tooltip={tooltip}
        relativeHeight={relativeHeight}
        onSeriesMouseOver={onSeriesMouseOver}
        showColorScale={showColorScale}
        highlightedDataPoints={highlightedDataPoints}
        graphID={graphID}
        minValue={minValue}
        maxValue={maxValue}
        onSeriesMouseClick={onSeriesMouseClick}
        showAxis={showAxis}
        graphDownload={graphDownload}
        dataDownload={dataDownload}
        prefix={prefix}
        suffix={suffix}
        stripType={stripType}
        language={language}
        highlightColor={highlightColor}
        dotOpacity={dotOpacity}
        showNAColor={showNAColor}
        minHeight={minHeight}
        mode={mode}
        ariaLabel={ariaLabel}
        resetSelectionOnDoubleClick={resetSelectionOnDoubleClick}
        styles={styles}
        detailsOnClick={detailsOnClick}
      />
    );
  return (
    <HorizontalStripChart
      data={data}
      graphTitle={graphTitle}
      colors={colors}
      sources={sources}
      graphDescription={graphDescription}
      height={height}
      width={width}
      footNote={footNote}
      colorDomain={colorDomain}
      colorLegendTitle={colorLegendTitle}
      radius={radius}
      padding={padding}
      backgroundColor={backgroundColor}
      leftMargin={leftMargin}
      rightMargin={rightMargin}
      topMargin={topMargin}
      bottomMargin={bottomMargin}
      tooltip={tooltip}
      relativeHeight={relativeHeight}
      onSeriesMouseOver={onSeriesMouseOver}
      showColorScale={showColorScale}
      highlightedDataPoints={highlightedDataPoints}
      graphID={graphID}
      minValue={minValue}
      maxValue={maxValue}
      onSeriesMouseClick={onSeriesMouseClick}
      showAxis={showAxis}
      graphDownload={graphDownload}
      dataDownload={dataDownload}
      prefix={prefix}
      suffix={suffix}
      stripType={stripType}
      language={language}
      highlightColor={highlightColor}
      dotOpacity={dotOpacity}
      showNAColor={showNAColor}
      minHeight={minHeight}
      mode={mode}
      ariaLabel={ariaLabel}
      resetSelectionOnDoubleClick={resetSelectionOnDoubleClick}
      styles={styles}
      detailsOnClick={detailsOnClick}
    />
  );
}
