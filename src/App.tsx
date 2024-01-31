import undpLogo from './assets/undp-logo-blue.svg';

function App() {
  return (
    <div className='undp-container flex-div flex-wrap flex-hor-align-center margin-top-13 margin-bottom-13'>
      <div>
        <img
          src={undpLogo}
          className='logo react'
          alt='React logo'
          width='72px'
          style={{ margin: 'auto' }}
        />
      </div>
      <h3
        className='undp-typography'
        style={{ textAlign: 'center', width: '100%' }}
      >
        This is the starter kit for data visualization utilities like bar
        charts, line chart, area charts etc. You can read the documentation{' '}
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
      </h3>
    </div>
  );
}

export default App;
