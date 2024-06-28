import { CopyTextButton } from './Components/Actions/CopyTextButton';
import './styles/styles.css';

function App() {
  return (
    <div className='undp-container flex-div flex-wrap flex-hor-align-center padding-07'>
      <h2 className='undp-typography'>undp-visualization-library</h2>
      <h5
        className='undp-typography'
        style={{ textAlign: 'center', width: '100%' }}
      >
        This is an open source graphing library build by United Nations
        Development Programme for data visualization utilities like bar charts,
        line chart, area charts etc. You can read the documentation{' '}
        <a
          href='mailto:data@undp.org'
          target='_blank'
          rel='noreferrer'
          className='undp-style'
        >
          here
        </a>
        .
        <br />
        <br />
        Contact us at{' '}
        <a
          href='mailto:data@undp.org'
          target='_blank'
          rel='noreferrer'
          className='undp-style'
        >
          data@undp.org
        </a>{' '}
        if you have any feedback or questions.
      </h5>
      <CopyTextButton text='Text copy' />
    </div>
  );
}

export default App;
