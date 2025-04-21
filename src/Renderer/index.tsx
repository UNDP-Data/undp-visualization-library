import ReactDOM from 'react-dom/client';

import { GriddedGraphsFromConfig } from '@/Components/Dashboard/GriddedGraphsFromConfig';
import { MultiGraphDashboardFromConfig } from '@/Components/Dashboard/MultiGraphDashboardFromConfig';
import { MultiGraphDashboardWideToLongFormatFromConfig } from '@/Components/Dashboard/MultiGraphDashboardWideToLongFormatFromConfig';
import { SingleGraphDashboardFromConfig } from '@/Components/Dashboard/SingleGraphDashboardFromConfig';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Dashboard(div: Element, config: any) {
  const rootEmbed = ReactDOM.createRoot(div);
  rootEmbed.render(<MultiGraphDashboardFromConfig config={config} />);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function DashboardWithDataTransform(div: Element, config: any) {
  const rootEmbed = ReactDOM.createRoot(div);
  rootEmbed.render(
    <MultiGraphDashboardWideToLongFormatFromConfig config={config} />,
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function GriddedGraph(div: Element, config: any) {
  const rootEmbed = ReactDOM.createRoot(div);
  rootEmbed.render(<GriddedGraphsFromConfig config={config} />);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Graph(div: Element, config: any) {
  const rootEmbed = ReactDOM.createRoot(div);
  rootEmbed.render(<SingleGraphDashboardFromConfig config={config} />);
}
