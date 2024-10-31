import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { MultiGraphDashboardFromConfig } from './Components/Dashboard/MultiGraphDashboardFromConfig';
import { SingleGraphDashboardFromConfig } from './Components/Dashboard/SingleGraphDashboardFromConfig';
import { GriddedGraphsFromConfig } from './Components/Dashboard/GriddedGraphsFromConfig';
import { MultiGraphDashboardWideToLongFormatFromConfig } from './Components/Dashboard/MultiGraphDashboardWideToLongFormatFromConfig';

const rootDiv = document.getElementById('root');
if (rootDiv) {
  ReactDOM.createRoot(rootDiv as HTMLElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}

const dashboardDivWithConfigLink = document.querySelectorAll(
  'div[dashboard-config-link]',
);

dashboardDivWithConfigLink.forEach(div => {
  if (div.getAttribute('dashboard-config-link')) {
    const rootEmbed = ReactDOM.createRoot(div);
    rootEmbed.render(
      <MultiGraphDashboardFromConfig
        config={div.getAttribute('dashboard-config-link') as string}
      />,
    );
  }
});

const dashboardDivWithConfig = document.querySelectorAll(
  'div[dashboard-config]',
);

dashboardDivWithConfig.forEach(div => {
  if (div.getAttribute('dashboard-config')) {
    const rootEmbed = ReactDOM.createRoot(div);
    rootEmbed.render(
      <MultiGraphDashboardFromConfig
        config={JSON.parse(div.getAttribute('dashboard-config') as string)}
      />,
    );
  }
});

const wideToLongDashboardDivWithConfigLink = document.querySelectorAll(
  'div[wide-to-long-dashboard-config-link]',
);

wideToLongDashboardDivWithConfigLink.forEach(div => {
  if (div.getAttribute('wide-to-long-dashboard-config-link')) {
    const rootEmbed = ReactDOM.createRoot(div);
    rootEmbed.render(
      <MultiGraphDashboardWideToLongFormatFromConfig
        config={
          div.getAttribute('wide-to-long-dashboard-config-link') as string
        }
      />,
    );
  }
});

const wideToLongDashboardDivWithConfig = document.querySelectorAll(
  'div[wide-to-long-dashboard-config]',
);

wideToLongDashboardDivWithConfig.forEach(div => {
  if (div.getAttribute('wide-to-long-dashboard-config')) {
    const rootEmbed = ReactDOM.createRoot(div);
    rootEmbed.render(
      <MultiGraphDashboardWideToLongFormatFromConfig
        config={JSON.parse(
          div.getAttribute('wide-to-long-dashboard-config') as string,
        )}
      />,
    );
  }
});

const graphDivWithConfigLink = document.querySelectorAll(
  'div[graph-config-link]',
);

graphDivWithConfigLink.forEach(div => {
  if (div.getAttribute('graph-config-link')) {
    const rootEmbed = ReactDOM.createRoot(div);
    rootEmbed.render(
      <SingleGraphDashboardFromConfig
        config={div.getAttribute('graph-config-link') as string}
      />,
    );
  }
});

const graphDivWithConfig = document.querySelectorAll('div[graph-config]');

graphDivWithConfig.forEach(div => {
  if (div.getAttribute('graph-config')) {
    const rootEmbed = ReactDOM.createRoot(div);
    rootEmbed.render(
      <SingleGraphDashboardFromConfig
        config={JSON.parse(div.getAttribute('graph-config') as string)}
      />,
    );
  }
});

const griddedGraphDivWithConfigLink = document.querySelectorAll(
  'div[gridded-graph-config-link]',
);

griddedGraphDivWithConfigLink.forEach(div => {
  if (div.getAttribute('gridded-graph-config-link')) {
    const rootEmbed = ReactDOM.createRoot(div);
    rootEmbed.render(
      <GriddedGraphsFromConfig
        config={div.getAttribute('gridded-graph-config-link') as string}
      />,
    );
  }
});

const griddedGraphDivWithConfig = document.querySelectorAll(
  'div[gridded-graph-config]',
);

griddedGraphDivWithConfig.forEach(div => {
  if (div.getAttribute('gridded-graph-config')) {
    const rootEmbed = ReactDOM.createRoot(div);
    rootEmbed.render(
      <GriddedGraphsFromConfig
        config={JSON.parse(div.getAttribute('gridded-graph-config') as string)}
      />,
    );
  }
});
