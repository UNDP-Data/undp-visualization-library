import {
  ReferenceDataType,
  SourcesDataType,
  Languages,
  BarGraphWithDateDataType,
  StyleObject,
  ClassNameObject,
  GroupedBarGraphWithDateDataType,
} from '../../../Types';
import { AnimatedHorizontalBarChart } from './Horizontal/BarGraph/Animated';
import { AnimatedHorizontalGroupedBarGraph } from './Horizontal/GroupedBarGraph/Animated';
import { AnimatedHorizontalStackedBarChart } from './Horizontal/StackedBarGraph/Animated';
import { AnimatedVerticalBarChart } from './Vertical/BarGraph/Animated';
import { AnimatedVerticalGroupedBarGraph } from './Vertical/GroupedBarGraph/Animated';
import { AnimatedVerticalStackedBarChart } from './Vertical/StackedBarGraph/Animated';

interface Props {
  data: BarGraphWithDateDataType[];
  colors?: string | string[];
  graphTitle?: string;
  graphDescription?: string;
  footNote?: string;
  width?: number;
  height?: number;
  suffix?: string;
  prefix?: string;
  sources?: SourcesDataType[];
  barPadding?: number;
  showValues?: boolean;
  showTicks?: boolean;
  leftMargin?: number;
  rightMargin?: number;
  truncateBy?: number;
  colorDomain?: string[];
  colorLegendTitle?: string;
  backgroundColor?: string | boolean;
  padding?: string;
  topMargin?: number;
  bottomMargin?: number;
  relativeHeight?: number;
  showLabels?: boolean;
  showColorScale?: boolean;
  maxValue?: number;
  minValue?: number;
  tooltip?: string;
  onSeriesMouseOver?: (_d: any) => void;
  refValues?: ReferenceDataType[];
  graphID?: string;
  highlightedDataPoints?: (string | number)[];
  onSeriesMouseClick?: (_d: any) => void;
  graphDownload?: boolean;
  dataDownload?: boolean;
  dateFormat?: string;
  showOnlyActiveDate?: boolean;
  autoPlay?: boolean;
  autoSort?: boolean;
  language?: Languages;
  showNAColor?: boolean;
  minHeight?: number;
  mode?: 'light' | 'dark';
  maxBarThickness?: number;
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

export function AnimatedBarGraph(props: Props) {
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
    highlightedDataPoints,
    padding,
    relativeHeight,
    tooltip,
    onSeriesMouseOver,
    refValues,
    showColorScale,
    graphID,
    maxValue,
    minValue,
    onSeriesMouseClick,
    dateFormat,
    showOnlyActiveDate,
    autoPlay,
    autoSort,
    graphDownload,
    dataDownload,
    language,
    mode,
    showNAColor,
    minHeight,
    maxBarThickness,
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
      <AnimatedVerticalBarChart
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
        highlightedDataPoints={highlightedDataPoints}
        padding={padding}
        relativeHeight={relativeHeight}
        tooltip={tooltip}
        onSeriesMouseOver={onSeriesMouseOver}
        refValues={refValues}
        showColorScale={showColorScale}
        graphID={graphID}
        maxValue={maxValue}
        minValue={minValue}
        onSeriesMouseClick={onSeriesMouseClick}
        dateFormat={dateFormat}
        showOnlyActiveDate={showOnlyActiveDate}
        autoPlay={autoPlay}
        autoSort={autoSort}
        graphDownload={graphDownload}
        dataDownload={dataDownload}
        language={language}
        mode={mode}
        showNAColor={showNAColor}
        minHeight={minHeight}
        maxBarThickness={maxBarThickness}
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
    <AnimatedHorizontalBarChart
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
      highlightedDataPoints={highlightedDataPoints}
      padding={padding}
      relativeHeight={relativeHeight}
      tooltip={tooltip}
      onSeriesMouseOver={onSeriesMouseOver}
      refValues={refValues}
      showColorScale={showColorScale}
      graphID={graphID}
      maxValue={maxValue}
      minValue={minValue}
      onSeriesMouseClick={onSeriesMouseClick}
      dateFormat={dateFormat}
      showOnlyActiveDate={showOnlyActiveDate}
      autoPlay={autoPlay}
      autoSort={autoSort}
      graphDownload={graphDownload}
      dataDownload={dataDownload}
      language={language}
      mode={mode}
      showNAColor={showNAColor}
      minHeight={minHeight}
      maxBarThickness={maxBarThickness}
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
  data: GroupedBarGraphWithDateDataType[];
  colors?: string[];
  graphTitle?: string;
  width?: number;
  height?: number;
  suffix?: string;
  prefix?: string;
  sources?: SourcesDataType[];
  graphDescription?: string;
  footNote?: string;
  barPadding?: number;
  showLabels?: boolean;
  showValues?: boolean;
  showTicks?: boolean;
  colorDomain: string[];
  colorLegendTitle?: string;
  truncateBy?: number;
  backgroundColor?: string | boolean;
  padding?: string;
  leftMargin?: number;
  rightMargin?: number;
  topMargin?: number;
  bottomMargin?: number;
  relativeHeight?: number;
  tooltip?: string;
  onSeriesMouseOver?: (_d: any) => void;
  refValues?: ReferenceDataType[];
  graphID?: string;
  maxValue?: number;
  minValue?: number;
  onSeriesMouseClick?: (_d: any) => void;
  graphDownload?: boolean;
  dataDownload?: boolean;
  dateFormat?: string;
  showOnlyActiveDate?: boolean;
  autoPlay?: boolean;
  language?: Languages;
  minHeight?: number;
  mode?: 'light' | 'dark';
  maxBarThickness?: number;
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

export function AnimatedGroupedBarGraph(props: GroupedBarChartProps) {
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
    showLabels,
    bottomMargin,
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
    dateFormat,
    showOnlyActiveDate,
    autoPlay,
    language,
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
      <AnimatedVerticalGroupedBarGraph
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
        showLabels={showLabels}
        bottomMargin={bottomMargin}
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
        dateFormat={dateFormat}
        showOnlyActiveDate={showOnlyActiveDate}
        autoPlay={autoPlay}
        language={language}
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
    <AnimatedHorizontalGroupedBarGraph
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
      showLabels={showLabels}
      bottomMargin={bottomMargin}
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
      dateFormat={dateFormat}
      showOnlyActiveDate={showOnlyActiveDate}
      autoPlay={autoPlay}
      language={language}
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
  data: GroupedBarGraphWithDateDataType[];
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
  truncateBy?: number;
  colorDomain: string[];
  colorLegendTitle?: string;
  backgroundColor?: string | boolean;
  padding?: string;
  topMargin?: number;
  bottomMargin?: number;
  suffix?: string;
  prefix?: string;
  showValues?: boolean;
  showLabels?: boolean;
  relativeHeight?: number;
  tooltip?: string;
  onSeriesMouseOver?: (_d: any) => void;
  refValues?: ReferenceDataType[];
  graphID?: string;
  maxValue?: number;
  onSeriesMouseClick?: (_d: any) => void;
  graphDownload?: boolean;
  dataDownload?: boolean;
  dateFormat?: string;
  showOnlyActiveDate?: boolean;
  autoPlay?: boolean;
  autoSort?: boolean;
  language?: Languages;
  minHeight?: number;
  mode?: 'light' | 'dark';
  sortParameter?: number | 'total';
  maxBarThickness?: number;
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

export function AnimatedStackedBarGraph(props: StackedBarChartProps) {
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
    dateFormat,
    showOnlyActiveDate,
    autoPlay,
    autoSort,
    graphDownload,
    dataDownload,
    language,
    mode,
    minHeight,
    sortParameter,
    maxBarThickness,
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
      <AnimatedVerticalStackedBarChart
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
        dateFormat={dateFormat}
        showOnlyActiveDate={showOnlyActiveDate}
        autoPlay={autoPlay}
        autoSort={autoSort}
        graphDownload={graphDownload}
        dataDownload={dataDownload}
        language={language}
        mode={mode}
        minHeight={minHeight}
        sortParameter={sortParameter}
        maxBarThickness={maxBarThickness}
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
    <AnimatedHorizontalStackedBarChart
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
      dateFormat={dateFormat}
      showOnlyActiveDate={showOnlyActiveDate}
      autoPlay={autoPlay}
      autoSort={autoSort}
      graphDownload={graphDownload}
      dataDownload={dataDownload}
      language={language}
      mode={mode}
      minHeight={minHeight}
      sortParameter={sortParameter}
      maxBarThickness={maxBarThickness}
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
