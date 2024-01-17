import { CardSlideInContainer } from './Components/Cards/CardSlideInContainer';

function App() {
  return (
    <div
      className='undp-container margin-top-13 margin-bottom-13'
      style={{ overflowX: 'hidden' }}
    >
      <div
        className='undp-container'
        style={{
          width: '320px',
          height: '1800px',
          backgroundColor: 'var(--gray-300)',
        }}
      />
      <CardSlideInContainer
        direction='left'
        elements={[
          <div
            key={0}
            style={{
              width: '320px',
              height: '640px',
              backgroundColor: 'var(--gray-300)',
            }}
          />,
        ]}
      />
      <div
        className='undp-container'
        style={{
          width: '320px',
          height: '1800px',
          backgroundColor: 'var(--gray-300)',
        }}
      />
    </div>
  );
}

export default App;
