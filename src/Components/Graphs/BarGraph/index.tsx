import {
  ReferenceDataType,
  BarGraphDataType,
  SourcesDataType,
  Languages,
  StyleObject,
  ClassNameObject,
  GroupedBarGraphDataType,
} from '@/Types';
import { HorizontalBarGraph } from './Horizontal/BarGraph/Simple';
import { HorizontalGroupedBarGraph } from './Horizontal/GroupedBarGraph/Simple';
import { HorizontalStackedBarGraph } from './Horizontal/StackedBarGraph/Simple';
import { VerticalBarGraph } from './Vertical/BarGraph/Simple';
import { VerticalGroupedBarGraph } from './Vertical/GroupedBarGraph/Simple';
import { VerticalStackedBarGraph } from './Vertical/StackedBarGraph/Simple';

interface Props {
  // Data
  data: BarGraphDataType[];

  // Titles, Labels, and Sources
  graphTitle?: string;
  graphDescription?: string;
  footNote?: string;
  sources?: SourcesDataType[];
  ariaLabel?: string;
  barAxisTitle?: string;

  // Colors and Styling
  colors?: string | string[];
  colorDomain?: string[];
  colorLegendTitle?: string;
  valueColor?: string;
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
  barPadding?: number;
  maxBarThickness?: number;
  minBarThickness?: number;
  maxNumberOfBars?: number;

  // Values and Ticks
  prefix?: string;
  suffix?: string;
  maxValue?: number;
  minValue?: number;
  truncateBy?: number;
  refValues?: ReferenceDataType[];
  noOfTicks?: number;

  // Graph Parameters
  showLabels?: boolean;
  showValues?: boolean;
  labelOrder?: string[];
  showTicks?: boolean;
  showColorScale?: boolean;
  graphDownload?: boolean;
  dataDownload?: boolean;
  showNAColor?: boolean;
  resetSelectionOnDoubleClick?: boolean;

  // Interactions and Callbacks
  tooltip?: string;
  detailsOnClick?: string;
  onSeriesMouseOver?: (_d: any) => void;
  onSeriesMouseClick?: (_d: any) => void;
  highlightedDataPoints?: (string | number)[];

  // Configuration and Options
  sortData?: 'asc' | 'desc';
  language?: Languages;
  mode?: 'light' | 'dark';
  orientation?: 'vertical' | 'horizontal';
  graphID?: string;
}

export function SimpleBarGraph(props: Props) {
  const {
    data,
    graphTitle,
    colors,
    barPadding,
    showTicks,
    leftMargin,
    rightMargin,
    topMargin,
    bottomMargin,
    truncateBy,
    showLabels,
    showValues,
    backgroundColor,
    suffix,
    prefix,
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
    maxValue,
    minValue,
    highlightedDataPoints,
    onSeriesMouseClick,
    graphDownload,
    dataDownload,
    language,
    mode,
    sortData,
    labelOrder,
    showNAColor,
    minHeight,
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
      <VerticalBarGraph
        data={data}
        graphTitle={graphTitle}
        colors={colors}
        barPadding={barPadding}
        showTicks={showTicks}
        leftMargin={leftMargin}
        rightMargin={rightMargin}
        topMargin={topMargin}
        bottomMargin={bottomMargin}
        truncateBy={truncateBy}
        showLabels={showLabels}
        showValues={showValues}
        backgroundColor={backgroundColor}
        suffix={suffix}
        prefix={prefix}
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
        maxValue={maxValue}
        minValue={minValue}
        highlightedDataPoints={highlightedDataPoints}
        onSeriesMouseClick={onSeriesMouseClick}
        graphDownload={graphDownload}
        dataDownload={dataDownload}
        language={language}
        mode={mode}
        sortData={sortData}
        labelOrder={labelOrder}
        showNAColor={showNAColor}
        minHeight={minHeight}
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
    <HorizontalBarGraph
      data={data}
      graphTitle={graphTitle}
      colors={colors}
      barPadding={barPadding}
      showTicks={showTicks}
      leftMargin={leftMargin}
      rightMargin={rightMargin}
      topMargin={topMargin}
      bottomMargin={bottomMargin}
      truncateBy={truncateBy}
      showLabels={showLabels}
      showValues={showValues}
      backgroundColor={backgroundColor}
      suffix={suffix}
      prefix={prefix}
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
      maxValue={maxValue}
      minValue={minValue}
      highlightedDataPoints={highlightedDataPoints}
      onSeriesMouseClick={onSeriesMouseClick}
      graphDownload={graphDownload}
      dataDownload={dataDownload}
      language={language}
      mode={mode}
      sortData={sortData}
      labelOrder={labelOrder}
      showNAColor={showNAColor}
      minHeight={minHeight}
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

interface GroupedBarChartProps {
  // Data
  data: GroupedBarGraphDataType[];

  // Titles, Labels, and Sources
  graphTitle?: string;
  graphDescription?: string;
  footNote?: string;
  sources?: SourcesDataType[];
  ariaLabel?: string;
  barAxisTitle?: string;

  // Colors and Styling
  colors?: string[];
  colorDomain: string[];
  colorLegendTitle?: string;
  valueColor?: string;
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
  barPadding?: number;
  maxBarThickness?: number;

  // Values and Ticks
  prefix?: string;
  suffix?: string;
  maxValue?: number;
  minValue?: number;
  truncateBy?: number;
  refValues?: ReferenceDataType[];
  noOfTicks?: number;

  // Graph Parameters
  showLabels?: boolean;
  showValues?: boolean;
  labelOrder?: string[];
  showTicks?: boolean;
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

export function GroupedBarGraph(props: GroupedBarChartProps) {
  const {
    data,
    graphTitle,
    colors,
    sources,
    graphDescription,
    barPadding,
    showTicks,
    truncateBy,
    height,
    width,
    footNote,
    colorDomain,
    colorLegendTitle,
    suffix,
    prefix,
    showValues,
    padding,
    backgroundColor,
    leftMargin,
    rightMargin,
    topMargin,
    bottomMargin,
    showLabels,
    relativeHeight,
    tooltip,
    onSeriesMouseOver,
    refValues,
    graphID,
    maxValue,
    minValue,
    onSeriesMouseClick,
    graphDownload,
    dataDownload,
    language,
    labelOrder,
    minHeight,
    mode,
    maxBarThickness,
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
      <VerticalGroupedBarGraph
        data={data}
        graphTitle={graphTitle}
        colors={colors}
        sources={sources}
        graphDescription={graphDescription}
        barPadding={barPadding}
        showTicks={showTicks}
        truncateBy={truncateBy}
        height={height}
        width={width}
        footNote={footNote}
        colorDomain={colorDomain}
        colorLegendTitle={colorLegendTitle}
        suffix={suffix}
        prefix={prefix}
        showValues={showValues}
        padding={padding}
        backgroundColor={backgroundColor}
        leftMargin={leftMargin}
        rightMargin={rightMargin}
        topMargin={topMargin}
        bottomMargin={bottomMargin}
        showLabels={showLabels}
        relativeHeight={relativeHeight}
        tooltip={tooltip}
        onSeriesMouseOver={onSeriesMouseOver}
        refValues={refValues}
        graphID={graphID}
        maxValue={maxValue}
        minValue={minValue}
        onSeriesMouseClick={onSeriesMouseClick}
        graphDownload={graphDownload}
        dataDownload={dataDownload}
        language={language}
        labelOrder={labelOrder}
        minHeight={minHeight}
        mode={mode}
        maxBarThickness={maxBarThickness}
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
    <HorizontalGroupedBarGraph
      data={data}
      graphTitle={graphTitle}
      colors={colors}
      sources={sources}
      graphDescription={graphDescription}
      barPadding={barPadding}
      showTicks={showTicks}
      truncateBy={truncateBy}
      height={height}
      width={width}
      footNote={footNote}
      colorDomain={colorDomain}
      colorLegendTitle={colorLegendTitle}
      suffix={suffix}
      prefix={prefix}
      showValues={showValues}
      padding={padding}
      backgroundColor={backgroundColor}
      leftMargin={leftMargin}
      rightMargin={rightMargin}
      topMargin={topMargin}
      bottomMargin={bottomMargin}
      showLabels={showLabels}
      relativeHeight={relativeHeight}
      tooltip={tooltip}
      onSeriesMouseOver={onSeriesMouseOver}
      refValues={refValues}
      graphID={graphID}
      maxValue={maxValue}
      minValue={minValue}
      onSeriesMouseClick={onSeriesMouseClick}
      graphDownload={graphDownload}
      dataDownload={dataDownload}
      language={language}
      labelOrder={labelOrder}
      minHeight={minHeight}
      mode={mode}
      maxBarThickness={maxBarThickness}
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

interface StackedBarChartProps {
  // Data
  data: GroupedBarGraphDataType[];

  // Titles, Labels, and Sources
  graphTitle?: string;
  graphDescription?: string;
  footNote?: string;
  sources?: SourcesDataType[];
  ariaLabel?: string;
  barAxisTitle?: string;

  // Colors and Styling
  colors?: string[];
  colorDomain: string[];
  colorLegendTitle?: string;
  valueColor?: string;
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
  barPadding?: number;
  maxBarThickness?: number;
  minBarThickness?: number;
  maxNumberOfBars?: number;

  // Values and Ticks
  prefix?: string;
  suffix?: string;
  maxValue?: number;
  truncateBy?: number;
  refValues?: ReferenceDataType[];
  noOfTicks?: number;

  // Graph Parameters
  showLabels?: boolean;
  showValues?: boolean;
  labelOrder?: string[];
  showTicks?: boolean;
  graphDownload?: boolean;
  dataDownload?: boolean;
  resetSelectionOnDoubleClick?: boolean;

  // Interactions and Callbacks
  tooltip?: string;
  detailsOnClick?: string;
  onSeriesMouseOver?: (_d: any) => void;
  onSeriesMouseClick?: (_d: any) => void;

  // Configuration and Options
  sortParameter?: number | 'total';
  language?: Languages;
  mode?: 'light' | 'dark';
  orientation?: 'vertical' | 'horizontal';
  graphID?: string;
}

export function StackedBarGraph(props: StackedBarChartProps) {
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
    showLabels,
    showValues,
    backgroundColor,
    suffix,
    prefix,
    height,
    width,
    footNote,
    colorDomain,
    colorLegendTitle,
    padding,
    tooltip,
    onSeriesMouseOver,
    relativeHeight,
    refValues,
    graphID,
    maxValue,
    onSeriesMouseClick,
    graphDownload,
    dataDownload,
    language,
    mode,
    labelOrder,
    minHeight,
    maxBarThickness,
    sortParameter,
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
      <VerticalStackedBarGraph
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
        showLabels={showLabels}
        showValues={showValues}
        backgroundColor={backgroundColor}
        suffix={suffix}
        prefix={prefix}
        height={height}
        width={width}
        footNote={footNote}
        colorDomain={colorDomain}
        colorLegendTitle={colorLegendTitle}
        padding={padding}
        tooltip={tooltip}
        onSeriesMouseOver={onSeriesMouseOver}
        relativeHeight={relativeHeight}
        refValues={refValues}
        graphID={graphID}
        maxValue={maxValue}
        onSeriesMouseClick={onSeriesMouseClick}
        graphDownload={graphDownload}
        dataDownload={dataDownload}
        language={language}
        mode={mode}
        labelOrder={labelOrder}
        minHeight={minHeight}
        maxBarThickness={maxBarThickness}
        sortParameter={sortParameter}
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
    <HorizontalStackedBarGraph
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
      showLabels={showLabels}
      showValues={showValues}
      backgroundColor={backgroundColor}
      suffix={suffix}
      prefix={prefix}
      height={height}
      width={width}
      footNote={footNote}
      colorDomain={colorDomain}
      colorLegendTitle={colorLegendTitle}
      padding={padding}
      tooltip={tooltip}
      onSeriesMouseOver={onSeriesMouseOver}
      relativeHeight={relativeHeight}
      refValues={refValues}
      graphID={graphID}
      maxValue={maxValue}
      onSeriesMouseClick={onSeriesMouseClick}
      graphDownload={graphDownload}
      dataDownload={dataDownload}
      language={language}
      mode={mode}
      labelOrder={labelOrder}
      minHeight={minHeight}
      maxBarThickness={maxBarThickness}
      sortParameter={sortParameter}
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
