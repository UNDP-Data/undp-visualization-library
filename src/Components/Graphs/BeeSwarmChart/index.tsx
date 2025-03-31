import {
  ReferenceDataType,
  SourcesDataType,
  Languages,
  BeeSwarmChartDataType,
  StyleObject, ClassNameObject,
} from '../../../Types';
import { HorizontalBeeSwarmChart } from './Horizontal';
import { VerticalBeeSwarmChart } from './Vertical';

interface Props {
  data: BeeSwarmChartDataType[];
  colors?: string | string[];
  graphTitle?: string;
  graphDescription?: string;
  footNote?: string;
  width?: number;
  height?: number;
  sources?: SourcesDataType[];
  showTicks?: boolean;
  leftMargin?: number;
  rightMargin?: number;
  colorDomain?: string[];
  colorLegendTitle?: string;
  backgroundColor?: string | boolean;
  padding?: string;
  topMargin?: number;
  bottomMargin?: number;
  relativeHeight?: number;
  showLabels?: boolean;
  showColorScale?: boolean;
  tooltip?: string;
  onSeriesMouseOver?: (_d: any) => void;
  refValues?: ReferenceDataType[];
  graphID?: string;
  radius?: number;
  maxRadiusValue?: number;
  maxPositionValue?: number;
  minPositionValue?: number;
  highlightedDataPoints?: (string | number)[];
  onSeriesMouseClick?: (_d: any) => void;
  graphDownload?: boolean;
  dataDownload?: boolean;
  language?: Languages;
  showNAColor?: boolean;
  minHeight?: number;
  mode?: 'light' | 'dark';
  ariaLabel?: string;
  resetSelectionOnDoubleClick?: boolean;
  detailsOnClick?: string;
  orientation?: 'vertical' | 'horizontal';
  styles?: StyleObject; classNames?:  ClassNameObject;
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
    orientation = 'vertical',
    styles, classNames,
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
    />
  );
}
