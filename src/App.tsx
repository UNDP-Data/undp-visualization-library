import { RadarChart } from './Components/Graphs/RadarChart';
import './styles/styles.css';
import '@undp/design-system-react/dist/style.css';

function App() {
  return (
    <RadarChart
      data={[
        {
          values: [1, 2, 3, 4, 5],
        },
        {
          values: [1, 1, 2, 2, 3],
        },
        {
          values: [2, 2, 3, 4, 5],
        },
        {
          values: [4, 4, 4, 4, 4],
        },
      ]}
      axisLabels={['hello world', 'hi world', '123 world', '456 world', '789 world']}
    />
  );
}

export default App;
