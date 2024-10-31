import ReactDOM from 'react-dom/client';
import { GriddedGraphsFromConfig } from '../Components/Dashboard/GriddedGraphsFromConfig';
import { MultiGraphDashboardFromConfig } from '../Components/Dashboard/MultiGraphDashboardFromConfig';
import { MultiGraphDashboardWideToLongFormatFromConfig } from '../Components/Dashboard/MultiGraphDashboardWideToLongFormatFromConfig';
import { SingleGraphDashboardFromConfig } from '../Components/Dashboard/SingleGraphDashboardFromConfig';

export function Dashboard(div: Element, config: any) {
  const rootEmbed = ReactDOM.createRoot(div);
  rootEmbed.render(<MultiGraphDashboardFromConfig config={config} />);
}

export function DashboardWithDataTransform(div: Element, config: any) {
  const rootEmbed = ReactDOM.createRoot(div);
  rootEmbed.render(
    <MultiGraphDashboardWideToLongFormatFromConfig config={config} />,
  );
}

export function GriddedGraph(div: Element, config: any) {
  const rootEmbed = ReactDOM.createRoot(div);
  rootEmbed.render(<GriddedGraphsFromConfig config={config} />);
}

export function Graph(div: Element, config: any) {
  const rootEmbed = ReactDOM.createRoot(div);
  rootEmbed.render(<SingleGraphDashboardFromConfig config={config} />);
}
