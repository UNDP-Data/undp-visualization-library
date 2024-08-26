import {
  DataTableColumnDataType,
  GraphSettingsDataType,
  GraphType,
} from '../../Types';
import { validateDataSchema } from '../../Utils/validateDataSchema';
import { validateSettingsSchema } from '../../Utils/validateSettingsSchema';
import { HorizontalGroupedBarGraph } from '../Graphs/BarGraph/HorizontalBarGraph/GroupedBarGraph';
import { HorizontalBarGraph } from '../Graphs/BarGraph/HorizontalBarGraph/SimpleBarGraph';
import { HorizontalStackedBarGraph } from '../Graphs/BarGraph/HorizontalBarGraph/StackedBarGraph';
import { VerticalGroupedBarGraph } from '../Graphs/BarGraph/VerticalBarGraph/GroupedBarGraph';
import { VerticalBarGraph } from '../Graphs/BarGraph/VerticalBarGraph/SimpleBarGraph';
import { VerticalStackedBarGraph } from '../Graphs/BarGraph/VerticalBarGraph/StackedBarGraph';
import { HorizontalBeeSwarmChart } from '../Graphs/BeeSwarmChart/HorizontalBeeSwarmChart';
import { VerticalBeeSwarmChart } from '../Graphs/BeeSwarmChart/VerticalBeeSwarmChart';
import { ButterflyChart } from '../Graphs/ButterflyChart/SimpleButterflyChart';
import { CirclePackingGraph } from '../Graphs/CirclePackingGraph';
import { DataTable } from '../Graphs/DataTable';
import { DonutChart } from '../Graphs/DonutChart';
import { HorizontalDumbbellChart } from '../Graphs/DumbbellChart/HorizontalDumbbellChart/SimpleDumbbellChart';
import { VerticalDumbbellChart } from '../Graphs/DumbbellChart/VerticalDumbbellChart/SimpleDumbbellChart';
import { HeatMap } from '../Graphs/HeatMap';
import { Histogram } from '../Graphs/Histogram';
import { DualAxisLineChart } from '../Graphs/LineCharts/DualAxisLineChart';
import { SimpleLineChart } from '../Graphs/LineCharts/LineChart';
import { MultiLineChart } from '../Graphs/LineCharts/MultiLineChart';
import { SparkLine } from '../Graphs/LineCharts/SparkLine';
import { BiVariantMap } from '../Graphs/Maps/BiVariateMap/SimpleBiVariateMap';
import { ChoroplethMap } from '../Graphs/Maps/ChoroplethMap/SimpleChoroplethMap';
import { DotDensityMap } from '../Graphs/Maps/DotDensityMap/SimpleDotDensityMap';
import { GeoHubCompareMaps } from '../Graphs/Maps/GeoHubCompareMaps';
import { GeoHubMap } from '../Graphs/Maps/GeoHubMap';
import { ParetoChart } from '../Graphs/ParetoChart';
import { ScatterPlot } from '../Graphs/ScatterPlot/SimpleScatterPlot';
import { SlopeChart } from '../Graphs/SlopeChart';
import { AreaChart } from '../Graphs/StackedAreaChart';
import { StatCardFromData } from '../Graphs/StatCard/StatCardFromData';
import { HorizontalStripChart } from '../Graphs/StripChart/HorizontalStripChart';
import { VerticalStripChart } from '../Graphs/StripChart/VerticalStripChart';
import { TreeMapGraph } from '../Graphs/TreeMapGraph';

interface Props {
  graph: GraphType;
  graphData: any;
  settings?: GraphSettingsDataType;
}

function GraphEl(props: Props) {
  const { settings, graph, graphData } = props;
  return (
    <div
      style={{
        flexGrow: 1,
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        height: 'inherit',
        width: settings?.width ? 'fit-content' : '100%',
      }}
    >
      {validateSettingsSchema(settings || {}, graph) &&
      validateDataSchema(graphData, graph) ? (
        <>
          {graph === 'horizontalBarChart' ? (
            <HorizontalBarGraph
              data={graphData}
              colors={settings?.colors as string | string[] | undefined}
              graphTitle={settings?.graphTitle}
              graphDescription={settings?.graphDescription}
              footNote={settings?.footNote}
              sourceLink={settings?.sourceLink}
              height={settings?.height}
              suffix={settings?.suffix}
              prefix={settings?.prefix}
              source={settings?.source}
              barPadding={settings?.barPadding}
              showBarValue={settings?.showBarValue}
              showTicks={settings?.showTicks}
              leftMargin={settings?.leftMargin}
              rightMargin={settings?.rightMargin}
              truncateBy={settings?.truncateBy}
              colorDomain={settings?.colorDomain}
              colorLegendTitle={settings?.colorLegendTitle}
              backgroundColor={settings?.backgroundColor}
              padding={settings?.padding}
              topMargin={settings?.topMargin}
              bottomMargin={settings?.bottomMargin}
              relativeHeight={settings?.relativeHeight}
              showBarLabel={settings?.showBarLabel}
              showColorScale={settings?.showColorScale}
              maxValue={settings?.maxValue}
              minValue={settings?.minValue}
              tooltip={settings?.tooltip}
              refValues={settings?.refValues}
              graphID={settings?.graphID}
              highlightedDataPoints={settings?.highlightedDataPoints}
              graphDownload={settings?.graphDownload}
              sortData={settings?.sortData}
              rtl={settings?.rtl}
              language={settings?.language}
            />
          ) : null}
          {graph === 'horizontalGroupedBarChart' ? (
            <HorizontalGroupedBarGraph
              data={graphData}
              colors={settings?.colors as string[] | undefined}
              graphTitle={settings?.graphTitle}
              graphDescription={settings?.graphDescription}
              footNote={settings?.footNote}
              sourceLink={settings?.sourceLink}
              width={settings?.width}
              height={settings?.height}
              source={settings?.source}
              barPadding={settings?.barPadding}
              showTicks={settings?.showTicks}
              truncateBy={settings?.truncateBy}
              colorDomain={settings?.colorDomain as string[]}
              colorLegendTitle={settings?.colorLegendTitle}
              suffix={settings?.suffix}
              prefix={settings?.prefix}
              showBarValue={settings?.showBarValue}
              backgroundColor={settings?.backgroundColor}
              padding={settings?.padding}
              leftMargin={settings?.leftMargin}
              rightMargin={settings?.rightMargin}
              topMargin={settings?.topMargin}
              showBarLabel={settings?.showBarLabel}
              bottomMargin={settings?.bottomMargin}
              relativeHeight={settings?.relativeHeight}
              tooltip={settings?.tooltip}
              refValues={settings?.refValues}
              graphID={settings?.graphID}
              maxValue={settings?.maxValue}
              minValue={settings?.minValue}
              graphDownload={settings?.graphDownload}
              rtl={settings?.rtl}
              language={settings?.language}
            />
          ) : null}
          {graph === 'horizontalStackedBarChart' ? (
            <HorizontalStackedBarGraph
              data={graphData}
              colors={settings?.colors as string[] | undefined}
              graphTitle={settings?.graphTitle}
              graphDescription={settings?.graphDescription}
              footNote={settings?.footNote}
              sourceLink={settings?.sourceLink}
              width={settings?.width}
              height={settings?.height}
              source={settings?.source}
              barPadding={settings?.barPadding}
              showTicks={settings?.showTicks}
              leftMargin={settings?.leftMargin}
              rightMargin={settings?.rightMargin}
              truncateBy={settings?.truncateBy}
              colorDomain={settings?.colorDomain as string[]}
              colorLegendTitle={settings?.colorLegendTitle}
              backgroundColor={settings?.backgroundColor}
              padding={settings?.padding}
              topMargin={settings?.topMargin}
              bottomMargin={settings?.bottomMargin}
              suffix={settings?.suffix}
              prefix={settings?.prefix}
              showValues={settings?.showValues}
              showBarLabel={settings?.showBarLabel}
              relativeHeight={settings?.relativeHeight}
              tooltip={settings?.tooltip}
              refValues={settings?.refValues}
              graphID={settings?.graphID}
              maxValue={settings?.maxValue}
              graphDownload={settings?.graphDownload}
              rtl={settings?.rtl}
              language={settings?.language}
            />
          ) : null}
          {graph === 'verticalBarChart' ? (
            <VerticalBarGraph
              data={graphData}
              colors={settings?.colors as string[] | undefined}
              graphTitle={settings?.graphTitle}
              graphDescription={settings?.graphDescription}
              footNote={settings?.footNote}
              sourceLink={settings?.sourceLink}
              height={settings?.height}
              suffix={settings?.suffix}
              prefix={settings?.prefix}
              source={settings?.source}
              barPadding={settings?.barPadding}
              showBarValue={settings?.showBarValue}
              showTicks={settings?.showTicks}
              leftMargin={settings?.leftMargin}
              rightMargin={settings?.rightMargin}
              truncateBy={settings?.truncateBy}
              colorDomain={settings?.colorDomain}
              colorLegendTitle={settings?.colorLegendTitle}
              backgroundColor={settings?.backgroundColor}
              padding={settings?.padding}
              topMargin={settings?.topMargin}
              bottomMargin={settings?.bottomMargin}
              relativeHeight={settings?.relativeHeight}
              showBarLabel={settings?.showBarLabel}
              showColorScale={settings?.showColorScale}
              maxValue={settings?.maxValue}
              minValue={settings?.minValue}
              tooltip={settings?.tooltip}
              refValues={settings?.refValues}
              graphID={settings?.graphID}
              highlightedDataPoints={settings?.highlightedDataPoints}
              graphDownload={settings?.graphDownload}
              sortData={settings?.sortData}
              rtl={settings?.rtl}
              language={settings?.language}
            />
          ) : null}
          {graph === 'verticalGroupedBarChart' ? (
            <VerticalGroupedBarGraph
              data={graphData}
              colors={settings?.colors as string[] | undefined}
              graphTitle={settings?.graphTitle}
              graphDescription={settings?.graphDescription}
              footNote={settings?.footNote}
              sourceLink={settings?.sourceLink}
              width={settings?.width}
              height={settings?.height}
              source={settings?.source}
              barPadding={settings?.barPadding}
              showTicks={settings?.showTicks}
              truncateBy={settings?.truncateBy}
              colorDomain={settings?.colorDomain as string[]}
              colorLegendTitle={settings?.colorLegendTitle}
              suffix={settings?.suffix}
              prefix={settings?.prefix}
              showBarValue={settings?.showBarValue}
              backgroundColor={settings?.backgroundColor}
              padding={settings?.padding}
              leftMargin={settings?.leftMargin}
              rightMargin={settings?.rightMargin}
              topMargin={settings?.topMargin}
              showBarLabel={settings?.showBarLabel}
              bottomMargin={settings?.bottomMargin}
              relativeHeight={settings?.relativeHeight}
              tooltip={settings?.tooltip}
              refValues={settings?.refValues}
              graphID={settings?.graphID}
              maxValue={settings?.maxValue}
              minValue={settings?.minValue}
              graphDownload={settings?.graphDownload}
              rtl={settings?.rtl}
              language={settings?.language}
            />
          ) : null}
          {graph === 'verticalStackedBarChart' ? (
            <VerticalStackedBarGraph
              data={graphData}
              colors={settings?.colors as string[] | undefined}
              graphTitle={settings?.graphTitle}
              graphDescription={settings?.graphDescription}
              footNote={settings?.footNote}
              sourceLink={settings?.sourceLink}
              width={settings?.width}
              height={settings?.height}
              source={settings?.source}
              barPadding={settings?.barPadding}
              showTicks={settings?.showTicks}
              leftMargin={settings?.leftMargin}
              rightMargin={settings?.rightMargin}
              truncateBy={settings?.truncateBy}
              colorDomain={settings?.colorDomain as string[]}
              colorLegendTitle={settings?.colorLegendTitle}
              backgroundColor={settings?.backgroundColor}
              padding={settings?.padding}
              topMargin={settings?.topMargin}
              bottomMargin={settings?.bottomMargin}
              suffix={settings?.suffix}
              prefix={settings?.prefix}
              showValues={settings?.showValues}
              showBarLabel={settings?.showBarLabel}
              relativeHeight={settings?.relativeHeight}
              tooltip={settings?.tooltip}
              refValues={settings?.refValues}
              graphID={settings?.graphID}
              maxValue={settings?.maxValue}
              graphDownload={settings?.graphDownload}
              rtl={settings?.rtl}
              language={settings?.language}
            />
          ) : null}
          {graph === 'lineChart' ? (
            <SimpleLineChart
              data={graphData}
              graphID={settings?.graphID}
              color={settings?.color as string | undefined}
              graphTitle={settings?.graphTitle}
              graphDescription={settings?.graphDescription}
              footNote={settings?.footNote}
              sourceLink={settings?.sourceLink}
              width={settings?.width}
              height={settings?.height}
              suffix={settings?.suffix}
              prefix={settings?.prefix}
              source={settings?.source}
              noOfXTicks={settings?.noOfXTicks}
              dateFormat={settings?.dateFormat}
              showValues={settings?.showValues}
              backgroundColor={settings?.backgroundColor}
              padding={settings?.padding}
              leftMargin={settings?.leftMargin}
              rightMargin={settings?.rightMargin}
              topMargin={settings?.topMargin}
              bottomMargin={settings?.bottomMargin}
              relativeHeight={settings?.relativeHeight}
              tooltip={settings?.tooltip}
              refValues={settings?.refValues}
              highlightAreaSettings={
                settings?.highlightAreaSettings as
                  | [number | null, number | null]
                  | undefined
              }
              maxValue={settings?.maxValue}
              minValue={settings?.minValue}
              graphDownload={settings?.graphDownload}
              highlightAreaColor={settings?.highlightAreaColor}
              rtl={settings?.rtl}
              language={settings?.language}
            />
          ) : null}
          {graph === 'multiLineChart' ? (
            <MultiLineChart
              data={graphData}
              colors={settings?.colors as string[] | undefined}
              graphTitle={settings?.graphTitle}
              graphDescription={settings?.graphDescription}
              footNote={settings?.footNote}
              sourceLink={settings?.sourceLink}
              width={settings?.width}
              height={settings?.height}
              source={settings?.source}
              noOfXTicks={settings?.noOfXTicks}
              dateFormat={settings?.dateFormat}
              suffix={settings?.suffix}
              prefix={settings?.prefix}
              labels={settings?.labels as string[]}
              backgroundColor={settings?.backgroundColor}
              padding={settings?.padding}
              leftMargin={settings?.leftMargin}
              rightMargin={settings?.rightMargin}
              topMargin={settings?.topMargin}
              bottomMargin={settings?.bottomMargin}
              showValues={settings?.showValues}
              relativeHeight={settings?.relativeHeight}
              showColorLegendAtTop={settings?.showColorLegendAtTop}
              tooltip={settings?.tooltip}
              refValues={settings?.refValues}
              highlightAreaSettings={
                settings?.highlightAreaSettings as
                  | [number | null, number | null]
                  | undefined
              }
              graphID={settings?.graphID}
              maxValue={settings?.maxValue}
              minValue={settings?.minValue}
              highlightedLines={settings?.highlightedLines}
              graphDownload={settings?.graphDownload}
              highlightAreaColor={settings?.highlightAreaColor}
              rtl={settings?.rtl}
              language={settings?.language}
            />
          ) : null}
          {graph === 'sparkLine' ? (
            <SparkLine
              data={graphData}
              color={settings?.color as string | undefined}
              graphTitle={settings?.graphTitle}
              graphDescription={settings?.graphDescription}
              footNote={settings?.footNote}
              sourceLink={settings?.sourceLink}
              width={settings?.width}
              height={settings?.height}
              source={settings?.source}
              dateFormat={settings?.dateFormat}
              areaId={settings?.areaId}
              backgroundColor={settings?.backgroundColor}
              padding={settings?.padding}
              leftMargin={settings?.leftMargin}
              rightMargin={settings?.rightMargin}
              topMargin={settings?.topMargin}
              bottomMargin={settings?.bottomMargin}
              relativeHeight={settings?.relativeHeight}
              tooltip={settings?.tooltip}
              graphID={settings?.graphID}
              maxValue={settings?.maxValue}
              minValue={settings?.minValue}
              graphDownload={settings?.graphDownload}
              rtl={settings?.rtl}
              language={settings?.language}
            />
          ) : null}
          {graph === 'dualAxisLineChart' ? (
            <DualAxisLineChart
              data={graphData}
              graphTitle={settings?.graphTitle}
              graphDescription={settings?.graphDescription}
              lineTitles={settings?.lineTitles}
              footNote={settings?.footNote}
              sourceLink={settings?.sourceLink}
              width={settings?.width}
              height={settings?.height}
              suffix={settings?.suffix}
              prefix={settings?.prefix}
              source={settings?.source}
              noOfXTicks={settings?.noOfXTicks}
              dateFormat={settings?.dateFormat}
              showValues={settings?.showValues}
              backgroundColor={settings?.backgroundColor}
              padding={settings?.padding}
              leftMargin={settings?.leftMargin}
              rightMargin={settings?.rightMargin}
              topMargin={settings?.topMargin}
              bottomMargin={settings?.bottomMargin}
              lineColors={settings?.lineColors}
              sameAxes={settings?.sameAxes}
              relativeHeight={settings?.relativeHeight}
              tooltip={settings?.tooltip}
              highlightAreaSettings={
                settings?.highlightAreaSettings as
                  | [number | null, number | null]
                  | undefined
              }
              graphID={settings?.graphID}
              graphDownload={settings?.graphDownload}
              highlightAreaColor={settings?.highlightAreaColor}
              rtl={settings?.rtl}
              language={settings?.language}
            />
          ) : null}
          {graph === 'stackedAreaChart' ? (
            <AreaChart
              data={graphData}
              colors={settings?.colors as string[] | undefined}
              graphTitle={settings?.graphTitle}
              graphDescription={settings?.graphDescription}
              footNote={settings?.footNote}
              sourceLink={settings?.sourceLink}
              width={settings?.width}
              height={settings?.height}
              source={settings?.source}
              noOfXTicks={settings?.noOfXTicks}
              dateFormat={settings?.dateFormat}
              colorDomain={settings?.colorDomain as string[]}
              backgroundColor={settings?.backgroundColor}
              padding={settings?.padding}
              colorLegendTitle={settings?.colorLegendTitle}
              leftMargin={settings?.leftMargin}
              rightMargin={settings?.rightMargin}
              topMargin={settings?.topMargin}
              relativeHeight={settings?.relativeHeight}
              bottomMargin={settings?.bottomMargin}
              tooltip={settings?.tooltip}
              refValues={settings?.refValues}
              highlightAreaSettings={
                settings?.highlightAreaSettings as
                  | [number | null, number | null]
                  | undefined
              }
              graphID={settings?.graphID}
              maxValue={settings?.maxValue}
              minValue={settings?.minValue}
              graphDownload={settings?.graphDownload}
              highlightAreaColor={settings?.highlightAreaColor}
              showColorScale={settings?.showColorScale}
              rtl={settings?.rtl}
              language={settings?.language}
            />
          ) : null}
          {graph === 'scatterPlot' ? (
            <ScatterPlot
              data={graphData}
              graphTitle={settings?.graphTitle}
              graphDescription={settings?.graphDescription}
              footNote={settings?.footNote}
              sourceLink={settings?.sourceLink}
              width={settings?.width}
              height={settings?.height}
              source={settings?.source}
              showLabels={settings?.showLabels}
              colors={settings?.colors as string | string[] | undefined}
              colorDomain={settings?.colorDomain}
              colorLegendTitle={settings?.colorLegendTitle}
              pointRadius={settings?.pointRadius}
              xAxisTitle={settings?.xAxisTitle}
              yAxisTitle={settings?.yAxisTitle}
              backgroundColor={settings?.backgroundColor}
              padding={settings?.padding}
              leftMargin={settings?.leftMargin}
              rightMargin={settings?.rightMargin}
              topMargin={settings?.topMargin}
              bottomMargin={settings?.bottomMargin}
              relativeHeight={settings?.relativeHeight}
              tooltip={settings?.tooltip}
              refXValues={settings?.refXValues}
              refYValues={settings?.refYValues}
              highlightedDataPoints={settings?.highlightedDataPoints}
              highlightAreaSettings={
                settings?.highlightAreaSettings as
                  | [number | null, number | null, number | null, number | null]
                  | undefined
              }
              highlightAreaColor={settings?.highlightAreaColor}
              showColorScale={settings?.showColorScale}
              graphID={settings?.graphID}
              pointRadiusMaxValue={settings?.pointRadiusMaxValue}
              maxXValue={settings?.maxXValue}
              minXValue={settings?.minXValue}
              maxYValue={settings?.maxYValue}
              minYValue={settings?.minYValue}
              graphDownload={settings?.graphDownload}
              rtl={settings?.rtl}
              language={settings?.language}
            />
          ) : null}
          {graph === 'horizontalDumbbellChart' ? (
            <HorizontalDumbbellChart
              data={graphData}
              colors={settings?.colors as string[] | undefined}
              graphTitle={settings?.graphTitle}
              graphDescription={settings?.graphDescription}
              footNote={settings?.footNote}
              sourceLink={settings?.sourceLink}
              width={settings?.width}
              height={settings?.height}
              suffix={settings?.suffix}
              prefix={settings?.prefix}
              source={settings?.source}
              barPadding={settings?.barPadding}
              showDotValue={settings?.showDotValue}
              showTicks={settings?.showTicks}
              leftMargin={settings?.leftMargin}
              rightMargin={settings?.rightMargin}
              topMargin={settings?.topMargin}
              bottomMargin={settings?.bottomMargin}
              truncateBy={settings?.truncateBy}
              colorDomain={settings?.colorDomain as string[]}
              colorLegendTitle={settings?.colorLegendTitle}
              backgroundColor={settings?.backgroundColor}
              padding={settings?.padding}
              dotRadius={settings?.dotRadius}
              relativeHeight={settings?.relativeHeight}
              showLabel={settings?.showLabel}
              tooltip={settings?.tooltip}
              graphID={settings?.graphID}
              maxPositionValue={settings?.maxPositionValue}
              minPositionValue={settings?.minPositionValue}
              graphDownload={settings?.graphDownload}
              rtl={settings?.rtl}
              language={settings?.language}
            />
          ) : null}
          {graph === 'verticalDumbbellChart' ? (
            <VerticalDumbbellChart
              data={graphData}
              colors={settings?.colors as string[] | undefined}
              graphTitle={settings?.graphTitle}
              graphDescription={settings?.graphDescription}
              footNote={settings?.footNote}
              sourceLink={settings?.sourceLink}
              width={settings?.width}
              height={settings?.height}
              source={settings?.source}
              barPadding={settings?.barPadding}
              showTicks={settings?.showTicks}
              leftMargin={settings?.leftMargin}
              rightMargin={settings?.rightMargin}
              topMargin={settings?.topMargin}
              bottomMargin={settings?.bottomMargin}
              truncateBy={settings?.truncateBy}
              colorDomain={settings?.colorDomain as string[]}
              colorLegendTitle={settings?.colorLegendTitle}
              backgroundColor={settings?.backgroundColor}
              padding={settings?.padding}
              dotRadius={settings?.dotRadius}
              relativeHeight={settings?.relativeHeight}
              showDotValue={settings?.showDotValue}
              showLabel={settings?.showLabel}
              tooltip={settings?.tooltip}
              graphID={settings?.graphID}
              maxPositionValue={settings?.maxPositionValue}
              minPositionValue={settings?.minPositionValue}
              graphDownload={settings?.graphDownload}
              suffix={settings?.suffix}
              prefix={settings?.prefix}
              rtl={settings?.rtl}
              language={settings?.language}
            />
          ) : null}
          {graph === 'donutChart' ? (
            <DonutChart
              mainText={settings?.mainText}
              data={graphData}
              colors={settings?.colors as string[] | undefined}
              graphTitle={settings?.graphTitle}
              suffix={settings?.suffix}
              prefix={settings?.prefix}
              source={settings?.source}
              graphDescription={settings?.graphDescription}
              sourceLink={settings?.sourceLink}
              subNote={settings?.subNote}
              footNote={settings?.footNote}
              radius={settings?.radius}
              strokeWidth={settings?.strokeWidth}
              graphLegend={settings?.graphLegend}
              backgroundColor={settings?.backgroundColor}
              padding={settings?.padding}
              tooltip={settings?.tooltip}
              graphID={settings?.graphID}
              graphDownload={settings?.graphDownload}
              colorDomain={settings?.colorDomain}
              sortData={settings?.sortData}
              rtl={settings?.rtl}
              language={settings?.language}
            />
          ) : null}
          {graph === 'choroplethMap' ? (
            <ChoroplethMap
              graphTitle={settings?.graphTitle}
              mapData={settings?.mapData}
              graphDescription={settings?.graphDescription}
              footNote={settings?.footNote}
              sourceLink={settings?.sourceLink}
              width={settings?.width}
              height={settings?.height}
              source={settings?.source}
              domain={settings?.domain as string[] | number[]}
              colors={settings?.colors as string[] | undefined}
              colorLegendTitle={settings?.colorLegendTitle}
              categorical={settings?.categorical}
              data={graphData}
              scale={settings?.scale}
              centerPoint={settings?.centerPoint}
              backgroundColor={settings?.backgroundColor}
              mapBorderWidth={settings?.mapBorderWidth}
              mapNoDataColor={settings?.mapNoDataColor}
              mapBorderColor={settings?.mapBorderColor}
              relativeHeight={settings?.relativeHeight}
              padding={settings?.padding}
              isWorldMap={settings?.isWorldMap}
              tooltip={settings?.tooltip}
              showColorScale={settings?.showColorScale}
              zoomScaleExtend={settings?.zoomScaleExtend}
              zoomTranslateExtend={settings?.zoomTranslateExtend}
              graphID={settings?.graphID}
              highlightedCountryCodes={settings?.highlightedCountryCodes}
              graphDownload={settings?.graphDownload}
              mapProperty={settings?.mapProperty}
              showAntarctica={settings?.showAntarctica}
              rtl={settings?.rtl}
              language={settings?.language}
            />
          ) : null}
          {graph === 'biVariateChoroplethMap' ? (
            <BiVariantMap
              data={graphData}
              mapData={settings?.mapData}
              graphTitle={settings?.graphTitle}
              graphDescription={settings?.graphDescription}
              footNote={settings?.footNote}
              sourceLink={settings?.sourceLink}
              width={settings?.width}
              height={settings?.height}
              source={settings?.source}
              xColorLegendTitle={settings?.xColorLegendTitle}
              yColorLegendTitle={settings?.yColorLegendTitle}
              xDomain={settings?.xDomain as [number, number, number, number]}
              yDomain={settings?.yDomain as [number, number, number, number]}
              colors={settings?.colors as string[][] | undefined}
              scale={settings?.scale}
              centerPoint={settings?.centerPoint}
              backgroundColor={settings?.backgroundColor}
              mapBorderWidth={settings?.mapBorderWidth}
              mapNoDataColor={settings?.mapNoDataColor}
              padding={settings?.padding}
              mapBorderColor={settings?.mapBorderColor}
              relativeHeight={settings?.relativeHeight}
              tooltip={settings?.tooltip}
              isWorldMap={settings?.isWorldMap}
              zoomScaleExtend={settings?.zoomScaleExtend}
              zoomTranslateExtend={settings?.zoomTranslateExtend}
              graphID={settings?.graphID}
              highlightedCountryCodes={settings?.highlightedCountryCodes}
              mapProperty={settings?.mapProperty}
              graphDownload={settings?.graphDownload}
              showAntarctica={settings?.showAntarctica}
              rtl={settings?.rtl}
              language={settings?.language}
            />
          ) : null}
          {graph === 'dotDensityMap' ? (
            <DotDensityMap
              graphTitle={settings?.graphTitle}
              mapData={settings?.mapData}
              graphDescription={settings?.graphDescription}
              footNote={settings?.footNote}
              sourceLink={settings?.sourceLink}
              width={settings?.width}
              height={settings?.height}
              pointRadius={settings?.pointRadius}
              source={settings?.source}
              colors={settings?.colors as string | string[] | undefined}
              colorDomain={settings?.colorDomain}
              colorLegendTitle={settings?.colorLegendTitle}
              data={graphData}
              scale={settings?.scale}
              centerPoint={settings?.centerPoint}
              backgroundColor={settings?.backgroundColor}
              mapBorderWidth={settings?.mapBorderWidth}
              mapNoDataColor={settings?.mapNoDataColor}
              mapBorderColor={settings?.mapBorderColor}
              padding={settings?.padding}
              showLabel={settings?.showLabel}
              relativeHeight={settings?.relativeHeight}
              isWorldMap={settings?.isWorldMap}
              tooltip={settings?.tooltip}
              showColorScale={settings?.showColorScale}
              zoomScaleExtend={settings?.zoomScaleExtend}
              zoomTranslateExtend={settings?.zoomTranslateExtend}
              graphID={settings?.graphID}
              highlightedDataPoints={settings?.highlightedDataPoints}
              graphDownload={settings?.graphDownload}
              showAntarctica={settings?.showAntarctica}
              rtl={settings?.rtl}
              language={settings?.language}
            />
          ) : null}
          {graph === 'geoHubMap' ? (
            <GeoHubMap
              mapStyle={settings?.mapStyle as string}
              center={settings?.center}
              zoomLevel={settings?.zoomLevel}
              graphTitle={settings?.graphTitle}
              source={settings?.source}
              graphDescription={settings?.graphDescription}
              sourceLink={settings?.sourceLink}
              footNote={settings?.footNote}
              backgroundColor={settings?.backgroundColor}
              padding={settings?.padding}
              width={settings?.width}
              height={settings?.height}
              relativeHeight={settings?.relativeHeight}
              graphID={settings?.graphID}
              rtl={settings?.rtl}
              language={settings?.language}
            />
          ) : null}
          {graph === 'geoHubCompareMap' ? (
            <GeoHubCompareMaps
              graphTitle={settings?.graphTitle}
              source={settings?.source}
              graphDescription={settings?.graphDescription}
              sourceLink={settings?.sourceLink}
              footNote={settings?.footNote}
              backgroundColor={settings?.backgroundColor}
              padding={settings?.padding}
              width={settings?.width}
              height={settings?.height}
              relativeHeight={settings?.relativeHeight}
              graphID={settings?.graphID}
              mapStyles={settings?.mapStyles as [string, string]}
              center={settings?.center}
              zoomLevel={settings?.zoomLevel}
              rtl={settings?.rtl}
              language={settings?.language}
            />
          ) : null}
          {graph === 'treeMap' ? (
            <TreeMapGraph
              data={graphData}
              colors={settings?.colors as string | string[] | undefined}
              graphTitle={settings?.graphTitle}
              graphDescription={settings?.graphDescription}
              footNote={settings?.footNote}
              sourceLink={settings?.sourceLink}
              width={settings?.width}
              height={settings?.height}
              suffix={settings?.suffix}
              prefix={settings?.prefix}
              source={settings?.source}
              leftMargin={settings?.leftMargin}
              rightMargin={settings?.rightMargin}
              colorDomain={settings?.colorDomain}
              colorLegendTitle={settings?.colorLegendTitle}
              backgroundColor={settings?.backgroundColor}
              padding={settings?.padding}
              topMargin={settings?.topMargin}
              bottomMargin={settings?.bottomMargin}
              relativeHeight={settings?.relativeHeight}
              showLabel={settings?.showLabel}
              tooltip={settings?.tooltip}
              showColorScale={settings?.showColorScale}
              showValue={settings?.showValue}
              graphID={settings?.graphID}
              highlightedDataPoints={settings?.highlightedDataPoints}
              graphDownload={settings?.graphDownload}
              rtl={settings?.rtl}
              language={settings?.language}
            />
          ) : null}
          {graph === 'heatMap' ? (
            <HeatMap
              data={graphData}
              colors={settings?.colors as string[] | undefined}
              graphTitle={settings?.graphTitle}
              graphDescription={settings?.graphDescription}
              footNote={settings?.footNote}
              sourceLink={settings?.sourceLink}
              width={settings?.width}
              height={settings?.height}
              source={settings?.source}
              scaleType={settings?.scaleType}
              domain={settings?.domain as string[] | number[]}
              showColumnLabels={settings?.showColumnLabels}
              leftMargin={settings?.leftMargin}
              rightMargin={settings?.rightMargin}
              truncateBy={settings?.truncateBy}
              colorLegendTitle={settings?.colorLegendTitle}
              backgroundColor={settings?.backgroundColor}
              padding={settings?.padding}
              topMargin={settings?.topMargin}
              bottomMargin={settings?.bottomMargin}
              suffix={settings?.suffix}
              prefix={settings?.prefix}
              showValues={settings?.showValues}
              showRowLabels={settings?.showRowLabels}
              relativeHeight={settings?.relativeHeight}
              tooltip={settings?.tooltip}
              graphID={settings?.graphID}
              noDataColor={settings?.noDataColor}
              showColorScale={settings?.showColorScale}
              graphDownload={settings?.graphDownload}
              fillContainer={settings?.fillContainer}
              rtl={settings?.rtl}
              language={settings?.language}
            />
          ) : null}
          {graph === 'circlePacking' ? (
            <CirclePackingGraph
              data={graphData}
              colors={settings?.colors as string | string[] | undefined}
              graphTitle={settings?.graphTitle}
              graphDescription={settings?.graphDescription}
              footNote={settings?.footNote}
              sourceLink={settings?.sourceLink}
              width={settings?.width}
              height={settings?.height}
              suffix={settings?.suffix}
              prefix={settings?.prefix}
              source={settings?.source}
              leftMargin={settings?.leftMargin}
              rightMargin={settings?.rightMargin}
              colorDomain={settings?.colorDomain}
              colorLegendTitle={settings?.colorLegendTitle}
              backgroundColor={settings?.backgroundColor}
              padding={settings?.padding}
              topMargin={settings?.topMargin}
              bottomMargin={settings?.bottomMargin}
              relativeHeight={settings?.relativeHeight}
              showLabel={settings?.showLabel}
              tooltip={settings?.tooltip}
              showColorScale={settings?.showColorScale}
              showValue={settings?.showValue}
              graphID={settings?.graphID}
              highlightedDataPoints={settings?.highlightedDataPoints}
              graphDownload={settings?.graphDownload}
              rtl={settings?.rtl}
              language={settings?.language}
            />
          ) : null}
          {graph === 'slopeChart' ? (
            <SlopeChart
              data={graphData}
              graphTitle={settings?.graphTitle}
              graphDescription={settings?.graphDescription}
              footNote={settings?.footNote}
              sourceLink={settings?.sourceLink}
              width={settings?.width}
              height={settings?.height}
              source={settings?.source}
              showLabels={settings?.showLabels}
              colors={settings?.colors as string | string[] | undefined}
              colorDomain={settings?.colorDomain}
              colorLegendTitle={settings?.colorLegendTitle}
              pointRadius={settings?.pointRadius}
              axisTitle={settings?.axisTitle}
              backgroundColor={settings?.backgroundColor}
              padding={settings?.padding}
              leftMargin={settings?.leftMargin}
              rightMargin={settings?.rightMargin}
              topMargin={settings?.topMargin}
              bottomMargin={settings?.bottomMargin}
              relativeHeight={settings?.relativeHeight}
              tooltip={settings?.tooltip}
              highlightedDataPoints={settings?.highlightedDataPoints}
              showColorScale={settings?.showColorScale}
              graphID={settings?.graphID}
              maxValue={settings?.maxValue}
              minValue={settings?.minValue}
              graphDownload={settings?.graphDownload}
              fillContainer={settings?.fillContainer}
              rtl={settings?.rtl}
              language={settings?.language}
            />
          ) : null}
          {graph === 'dataTable' ? (
            <DataTable
              graphTitle={settings?.graphTitle}
              source={settings?.source}
              graphDescription={settings?.graphDescription}
              sourceLink={settings?.sourceLink}
              footNote={settings?.footNote}
              graphID={settings?.graphID}
              width={settings?.width}
              height={settings?.height}
              columnData={
                (settings?.columnData || []) as DataTableColumnDataType[]
              }
              data={graphData}
              rtl={settings?.rtl}
              language={settings?.language}
            />
          ) : null}
          {graph === 'verticalBeeSwarmChart' ? (
            <VerticalBeeSwarmChart
              data={graphData}
              colors={settings?.colors as string | string[] | undefined}
              graphTitle={settings?.graphTitle}
              graphDescription={settings?.graphDescription}
              footNote={settings?.footNote}
              sourceLink={settings?.sourceLink}
              width={settings?.width}
              height={settings?.height}
              source={settings?.source}
              showTicks={settings?.showTicks}
              leftMargin={settings?.leftMargin}
              rightMargin={settings?.rightMargin}
              colorDomain={settings?.colorDomain}
              colorLegendTitle={settings?.colorLegendTitle}
              backgroundColor={settings?.backgroundColor}
              padding={settings?.padding}
              topMargin={settings?.topMargin}
              bottomMargin={settings?.bottomMargin}
              relativeHeight={settings?.relativeHeight}
              showLabel={settings?.showLabel}
              showColorScale={settings?.showColorScale}
              tooltip={settings?.tooltip}
              refValues={settings?.refValues}
              graphID={settings?.graphID}
              pointRadius={settings?.pointRadius}
              pointRadiusMaxValue={settings?.pointRadiusMaxValue}
              maxPositionValue={settings?.maxPositionValue}
              minPositionValue={settings?.minPositionValue}
              highlightedDataPoints={settings?.highlightedDataPoints}
              graphDownload={settings?.graphDownload}
              rtl={settings?.rtl}
              language={settings?.language}
            />
          ) : null}
          {graph === 'horizontalBeeSwarmChart' ? (
            <HorizontalBeeSwarmChart
              data={graphData}
              colors={settings?.colors as string | string[] | undefined}
              graphTitle={settings?.graphTitle}
              graphDescription={settings?.graphDescription}
              footNote={settings?.footNote}
              sourceLink={settings?.sourceLink}
              width={settings?.width}
              height={settings?.height}
              source={settings?.source}
              showTicks={settings?.showTicks}
              leftMargin={settings?.leftMargin}
              rightMargin={settings?.rightMargin}
              colorDomain={settings?.colorDomain}
              colorLegendTitle={settings?.colorLegendTitle}
              backgroundColor={settings?.backgroundColor}
              padding={settings?.padding}
              topMargin={settings?.topMargin}
              bottomMargin={settings?.bottomMargin}
              relativeHeight={settings?.relativeHeight}
              showLabel={settings?.showLabel}
              showColorScale={settings?.showColorScale}
              tooltip={settings?.tooltip}
              refValues={settings?.refValues}
              graphID={settings?.graphID}
              pointRadius={settings?.pointRadius}
              pointRadiusMaxValue={settings?.pointRadiusMaxValue}
              maxPositionValue={settings?.maxPositionValue}
              minPositionValue={settings?.minPositionValue}
              highlightedDataPoints={settings?.highlightedDataPoints}
              graphDownload={settings?.graphDownload}
              rtl={settings?.rtl}
              language={settings?.language}
            />
          ) : null}
          {graph === 'butterflyChart' ? (
            <ButterflyChart
              data={graphData}
              graphTitle={settings?.graphTitle}
              graphDescription={settings?.graphDescription}
              leftBarTitle={settings?.leftBarTitle}
              rightBarTitle={settings?.rightBarTitle}
              footNote={settings?.footNote}
              sourceLink={settings?.sourceLink}
              width={settings?.width}
              height={settings?.height}
              source={settings?.source}
              backgroundColor={settings?.backgroundColor}
              padding={settings?.padding}
              leftMargin={settings?.leftMargin}
              rightMargin={settings?.rightMargin}
              topMargin={settings?.topMargin}
              bottomMargin={settings?.bottomMargin}
              barColors={settings?.barColors}
              relativeHeight={settings?.relativeHeight}
              tooltip={settings?.tooltip}
              graphID={settings?.graphID}
              graphDownload={settings?.graphDownload}
              barPadding={settings?.barPadding}
              truncateBy={settings?.truncateBy}
              suffix={settings?.suffix}
              prefix={settings?.prefix}
              showTicks={settings?.showTicks}
              showBarValue={settings?.showBarValue}
              centerGap={settings?.centerGap}
              maxValue={settings?.maxValue}
              minValue={settings?.minValue}
              showColorScale={settings?.showColorScale}
              refValues={settings?.refValues}
              rtl={settings?.rtl}
              language={settings?.language}
            />
          ) : null}
          {graph === 'histogram' ? (
            <Histogram
              data={graphData}
              color={settings?.color}
              graphTitle={settings?.graphTitle}
              graphDescription={settings?.graphDescription}
              footNote={settings?.footNote}
              sourceLink={settings?.sourceLink}
              width={settings?.width}
              height={settings?.height}
              source={settings?.source}
              barPadding={settings?.barPadding}
              showBarValue={settings?.showBarValue}
              showTicks={settings?.showTicks}
              leftMargin={settings?.leftMargin}
              rightMargin={settings?.rightMargin}
              backgroundColor={settings?.backgroundColor}
              padding={settings?.padding}
              topMargin={settings?.topMargin}
              bottomMargin={settings?.bottomMargin}
              relativeHeight={settings?.relativeHeight}
              showBarLabel={settings?.showBarLabel}
              maxValue={settings?.maxValue}
              tooltip={settings?.tooltip}
              refValues={settings?.refValues}
              graphID={settings?.graphID}
              graphDownload={settings?.graphDownload}
              numberOfBins={settings?.numberOfBins}
              truncateBy={settings?.truncateBy}
              donutStrokeWidth={settings?.donutStrokeWidth}
              sortData={settings?.sortData}
              barGraphLayout={settings?.barGraphLayout}
              graphType={settings?.graphType}
              rtl={settings?.rtl}
              language={settings?.language}
            />
          ) : null}
          {graph === 'paretoChart' ? (
            <ParetoChart
              data={graphData}
              graphTitle={settings?.graphTitle}
              graphDescription={settings?.graphDescription}
              barTitle={settings?.barTitle}
              lineTitle={settings?.lineTitle}
              footNote={settings?.footNote}
              sourceLink={settings?.sourceLink}
              width={settings?.width}
              height={settings?.height}
              source={settings?.source}
              backgroundColor={settings?.backgroundColor}
              padding={settings?.padding}
              leftMargin={settings?.leftMargin}
              rightMargin={settings?.rightMargin}
              topMargin={settings?.topMargin}
              bottomMargin={settings?.bottomMargin}
              barColor={settings?.barColor}
              lineColor={settings?.lineColor}
              sameAxes={settings?.sameAxes}
              relativeHeight={settings?.relativeHeight}
              tooltip={settings?.tooltip}
              graphID={settings?.graphID}
              graphDownload={settings?.graphDownload}
              barPadding={settings?.barPadding}
              truncateBy={settings?.truncateBy}
              showLabel={settings?.showLabel}
              rtl={settings?.rtl}
              language={settings?.language}
            />
          ) : null}
          {graph === 'statCard' ? (
            <StatCardFromData
              year={settings?.year}
              data={graphData}
              graphTitle={settings?.graphTitle || ''}
              graphDescription={settings?.graphDescription}
              suffix={settings?.suffix}
              prefix={settings?.prefix}
              source={settings?.source || ''}
              sourceLink={settings?.sourceLink}
              footNote={settings?.footNote}
              backgroundColor={settings?.backgroundColor}
              padding={settings?.padding}
              graphID={settings?.graphID}
              aggregationMethod={settings?.aggregationMethod}
              rtl={settings?.rtl}
              language={settings?.language}
            />
          ) : null}
          {graph === 'horizontalStripChart' ? (
            <HorizontalStripChart
              data={graphData}
              graphTitle={settings?.graphTitle}
              graphDescription={settings?.graphDescription}
              footNote={settings?.footNote}
              sourceLink={settings?.sourceLink}
              width={settings?.width}
              height={settings?.height}
              source={settings?.source}
              stripType={settings?.stripType}
              colors={settings?.colors as string | string[] | undefined}
              colorDomain={settings?.colorDomain}
              colorLegendTitle={settings?.colorLegendTitle}
              pointRadius={settings?.pointRadius}
              backgroundColor={settings?.backgroundColor}
              padding={settings?.padding}
              leftMargin={settings?.leftMargin}
              rightMargin={settings?.rightMargin}
              topMargin={settings?.topMargin}
              bottomMargin={settings?.bottomMargin}
              relativeHeight={settings?.relativeHeight}
              tooltip={settings?.tooltip}
              highlightedDataPoints={settings?.highlightedDataPoints}
              showColorScale={settings?.showColorScale}
              graphID={settings?.graphID}
              maxValue={settings?.maxValue}
              minValue={settings?.minValue}
              showAxis={settings?.showAxis}
              graphDownload={settings?.graphDownload}
              prefix={settings?.prefix}
              suffix={settings?.suffix}
              rtl={settings?.rtl}
              language={settings?.language}
            />
          ) : null}
          {graph === 'verticalStripChart' ? (
            <VerticalStripChart
              data={graphData}
              graphTitle={settings?.graphTitle}
              graphDescription={settings?.graphDescription}
              footNote={settings?.footNote}
              sourceLink={settings?.sourceLink}
              width={settings?.width}
              height={settings?.height}
              source={settings?.source}
              colors={settings?.colors as string | string[] | undefined}
              colorDomain={settings?.colorDomain}
              colorLegendTitle={settings?.colorLegendTitle}
              pointRadius={settings?.pointRadius}
              backgroundColor={settings?.backgroundColor}
              padding={settings?.padding}
              leftMargin={settings?.leftMargin}
              rightMargin={settings?.rightMargin}
              topMargin={settings?.topMargin}
              bottomMargin={settings?.bottomMargin}
              relativeHeight={settings?.relativeHeight}
              tooltip={settings?.tooltip}
              highlightedDataPoints={settings?.highlightedDataPoints}
              showColorScale={settings?.showColorScale}
              graphID={settings?.graphID}
              maxValue={settings?.maxValue}
              minValue={settings?.minValue}
              showAxis={settings?.showAxis}
              graphDownload={settings?.graphDownload}
              prefix={settings?.prefix}
              suffix={settings?.suffix}
              stripType={settings?.stripType}
              rtl={settings?.rtl}
              language={settings?.language}
            />
          ) : null}
        </>
      ) : null}
    </div>
  );
}

export default GraphEl;
