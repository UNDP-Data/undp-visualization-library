import { useEffect, useRef, useState } from 'react';
import { scaleLinear } from 'd3-scale';

interface Props {
  elements: JSX.Element[];
  direction: 'right' | 'left';
}

export function CardSlideInContainer(props: Props) {
  const { elements, direction } = props;
  const ref = useRef<HTMLDivElement>(null);
  const [transformX, setTransformX] = useState(
    direction === 'right' ? -70 : 70,
  );

  const handleScroll = () => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const scale = scaleLinear()
        .domain([window.innerHeight, 20])
        .range([direction === 'right' ? -70 : 70, 0]);
      if (rect.y < window.innerHeight && rect.y > -1 * rect.height) {
        if (rect.y > 20) {
          setTransformX(scale(rect.y));
        } else {
          setTransformX(0);
        }
      }
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div
      ref={ref}
      style={{
        transform: `translate(${transformX}%, 0%) translate3d(0px, 0px, 0px)`,
        width: '100%',
      }}
    >
      <div className='flex-div' style={{ justifyContent: 'space-around' }}>
        {elements.map(el => el)}
      </div>
    </div>
  );
}
