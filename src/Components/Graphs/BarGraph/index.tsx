import {
  ReferenceDataType,
  BarGraphDataType,
  SourcesDataType,
  Languages,
  StyleObject,
  ClassNameObject,
  GroupedBarGraphDataType,
} from '../../../Types';
import { HorizontalBarGraph } from './Horizontal/BarGraph/Simple';
import { HorizontalGroupedBarGraph } from './Horizontal/GroupedBarGraph/Simple';
import { HorizontalStackedBarGraph } from './Horizontal/StackedBarGraph/Simple';
import { VerticalBarGraph } from './Vertical/BarGraph/Simple';
import { VerticalGroupedBarGraph } from './Vertical/GroupedBarGraph/Simple';
import { VerticalStackedBarGraph } from './Vertical/StackedBarGraph/Simple';

interface Props {
  data: BarGraphDataType[];
  colors?: string | string[];
  graphTitle?: string;
  labelOrder?: string[];
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
  colorDomain?: string[];
  colorLegendTitle?: string;
  truncateBy?: number;
  backgroundColor?: string | boolean;
  padding?: string;
  leftMargin?: number;
  rightMargin?: number;
  topMargin?: number;
  relativeHeight?: number;
  bottomMargin?: number;
  tooltip?: string;
  onSeriesMouseOver?: (_d: any) => void;
  refValues?: ReferenceDataType[];
  showColorScale?: boolean;
  graphID?: string;
  maxValue?: number;
  minValue?: number;
  highlightedDataPoints?: (string | number)[];
  onSeriesMouseClick?: (_d: any) => void;
  graphDownload?: boolean;
  dataDownload?: boolean;
  sortData?: 'asc' | 'desc';
  language?: Languages;
  showNAColor?: boolean;
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
  data: GroupedBarGraphDataType[];
  colors?: string[];
  graphTitle?: string;
  graphDescription?: string;
  footNote?: string;
  width?: number;
  height?: number;
  sources?: SourcesDataType[];
  barPadding?: number;
  showTicks?: boolean;
  truncateBy?: number;
  colorDomain: string[];
  colorLegendTitle?: string;
  suffix?: string;
  prefix?: string;
  showValues?: boolean;
  backgroundColor?: string | boolean;
  padding?: string;
  leftMargin?: number;
  rightMargin?: number;
  topMargin?: number;
  showLabels?: boolean;
  bottomMargin?: number;
  relativeHeight?: number;
  minHeight?: number;
  tooltip?: string;
  onSeriesMouseOver?: (_d: any) => void;
  refValues?: ReferenceDataType[];
  graphID?: string;
  maxValue?: number;
  minValue?: number;
  onSeriesMouseClick?: (_d: any) => void;
  graphDownload?: boolean;
  dataDownload?: boolean;
  labelOrder?: string[];
  language?: Languages;
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
  data: GroupedBarGraphDataType[];
  colors?: string[];
  graphTitle?: string;
  width?: number;
  labelOrder?: string[];
  height?: number;
  sources?: SourcesDataType[];
  graphDescription?: string;
  footNote?: string;
  barPadding?: number;
  showLabels?: boolean;
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
  showValues?: boolean;
  suffix?: string;
  prefix?: string;
  relativeHeight?: number;
  tooltip?: string;
  onSeriesMouseOver?: (_d: any) => void;
  refValues?: ReferenceDataType[];
  graphID?: string;
  maxValue?: number;
  onSeriesMouseClick?: (_d: any) => void;
  graphDownload?: boolean;
  dataDownload?: boolean;
  language?: Languages;
  minHeight?: number;
  mode?: 'light' | 'dark';
  maxBarThickness?: number;
  sortParameter?: number | 'total';
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
