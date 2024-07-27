import './styles/styles.css';

function App() {
  return (
    <div>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          padding: '2rem',
        }}
      >
        <h2 className='undp-viz-typography'>undp-visualization-library</h2>
        <h5
          className='undp-viz-typography'
          style={{ textAlign: 'center', width: '100%' }}
        >
          This is an open source graphing library build by United Nations
          Development Programme for data visualization utilities like bar
          charts, line chart, area charts etc. You can read the documentation{' '}
          <a
            href='mailto:data@undp.org'
            target='_blank'
            rel='noreferrer'
            className='undp-viz-style'
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
            className='undp-viz-style'
          >
            data@undp.org
          </a>{' '}
          if you have any feedback or questions.
        </h5>
      </div>
    </div>
  );
}

export default App;
