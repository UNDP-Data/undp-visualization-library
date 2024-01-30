/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { AreaChart } from './Components/Graphs/AreaChart';
import { HorizontalBarGraph } from './Components/Graphs/BarGraph/HorizontalBarGraph/SimpleBarGraph';
import { VerticalGroupedBarGraph } from './Components/Graphs/BarGraph/VerticalBarGraph/GroupedBarGraph';
import { VerticalBarGraph } from './Components/Graphs/BarGraph/VerticalBarGraph/SimpleBarGraph';
import { DonutChart } from './Components/Graphs/DonutChart';
import { SimpleLineChart } from './Components/Graphs/LineCharts/LineChart';
import NavEl from './NavEl';
import undpLogo from './assets/undp-logo-blue.svg';

function App() {
  return (
    <div className='undp-container flex-div flex-wrap gap-00'>
      <header
        style={{
          position: 'fixed',
          top: 0,
          height: '100%',
          overflow: 'auto',
          backgroundColor: 'var(--gray-200)',
          width: '240px',
        }}
      >
        <div
          style={{
            padding: '1rem',
          }}
        >
          <div className='flex-div flex-vert-align-center margin-bottom-07'>
            <img
              src={undpLogo}
              className='logo react'
              alt='React logo'
              width='48px'
              style={{ margin: 'auto' }}
            />
            <p className='undp-typography small-font bold margin-bottom-00'>
              UNDP Design System & AntD for React Integration
            </p>
          </div>
          <div>
            <NavEl type='doc' text='About' />
            <NavEl type='doc' text='Getting Started (How to use)' />
            <NavEl type='folder' text='Foundations' />
            <div style={{ padding: '0 0 0 0.75rem' }}>
              <NavEl type='doc' text='Colors' />
              <NavEl type='doc' text='Typography' />
              <NavEl type='doc' text='Icons' />
              <NavEl type='doc' text='Spacing Variables' />
              <NavEl type='doc' text='Layout Classes' />
            </div>
            <NavEl type='folder' text='Components' />
            <div style={{ padding: '0 0 0 0.75rem' }}>
              <NavEl type='doc' text='Alert Message' />
              <NavEl type='doc' text='Breadcrumbs' />
              <NavEl type='doc' text='Buttons' />
              <NavEl type='doc' text='Checkbox' />
              <NavEl type='doc' text='Divider' />
              <NavEl type='doc' text='Dropdown Menu' />
              <NavEl type='doc' text='Footer' />
              <NavEl type='doc' text='Header' />
            </div>
          </div>
        </div>
      </header>
      <div
        style={{
          marginLeft: '240px',
          display: 'flex',
          width: '50%',
          height: '420px',
        }}
      >
        <AreaChart
          graphTitle='Test test'
          graphDescription='Test test'
          source='Test Tes'
          footNote='test tes'
          padding='1rem'
          data={[
            {
              date: '2000',
              y: [10, 1, 2, 3],
            },
            {
              date: '2005',
              y: [4, 1, 2, 3],
            },
            {
              date: '2010',
              y: [7, 1, 2, 3],
            },
            {
              date: '2015',
              y: [17, 1, 2, 3],
            },
            {
              date: '2020',
              y: [10, 1, 2, 3],
            },
          ]}
          labels={['a', 'b', 'c', 'd']}
        />
      </div>
    </div>
  );
}

export default App;
