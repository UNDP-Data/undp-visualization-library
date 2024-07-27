import { useRef, useState } from 'react';
import { SingleCardEl } from './SingleCard';

interface Props {
  cards: JSX.Element[];
}

export function CardsSlider(props: Props) {
  const { cards } = props;
  const WrapperRef = useRef<HTMLDivElement>(null);
  const [cursor, setCursor] = useState(
    'url(https://design.undp.org/static/media/arrow-right.125a0586.svg)',
  );
  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div
      style={{
        cursor: `${cursor}, auto`,
        width: '100%',
        marginBottom: 0,
      }}
      onClick={e => {
        if (WrapperRef.current) {
          if (e.clientX > window.innerWidth / 2)
            WrapperRef.current.scrollBy(50, 0);
          else WrapperRef.current.scrollBy(-50, 0);
        }
      }}
      onMouseMove={e => {
        if (e.clientX > window.innerWidth / 2)
          setCursor(
            'url(https://design.undp.org/static/media/arrow-right.125a0586.svg)',
          );
        else
          setCursor(
            'url(https://design.undp.org/static/media/arrow-left.14de54ea.svg)',
          );
      }}
    >
      <div
        style={{
          scrollSnapType: 'x mandatory',
          scrollPadding: '0',
          scrollPaddingLeft: '0',
          display: 'flex',
          overflowX: 'auto',
          paddingBottom: '1rem',
        }}
        className='undp-viz-scrollbar'
        ref={WrapperRef}
      >
        {cards.map((el, i) => (
          <SingleCardEl key={i} contentEl={el} />
        ))}
      </div>
    </div>
  );
}
