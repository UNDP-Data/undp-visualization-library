/* eslint-disable react/no-danger */
import { cn } from '@undp-data/undp-design-system-react';
import { CSSObject } from '../../Types';
import { string2HTML } from '../../Utils/string2HTML';

interface Props {
  body: string;
  xPos: number;
  yPos: number;
  data: any;
  backgroundStyle?: CSSObject;
  className?: string;
}

export function Tooltip(props: Props) {
  const {
    body,
    xPos,
    yPos,
    data,
    backgroundStyle = {
      maxWidth: '24rem',
      wordWrap: 'break-word',
    },
    className,
  } = props;
  const htmlString = string2HTML(body, data);
  return (
    <div
      className={cn(
        'block p-2 fixed z-[1000] bg-primary-gray-200 dark:bg-primary-gray-600 border border-primary-gray-300 dark:border-primary-gray-500',
        className,
      )}
      style={{
        ...backgroundStyle,
        top: `${yPos < window.innerHeight / 2 ? yPos - 10 : yPos + 10}px`,
        left: `${xPos > window.innerWidth / 2 ? xPos - 10 : xPos + 10}px`,
        transform: `translate(${
          xPos > window.innerWidth / 2 ? '-100%' : '0%'
        },${yPos > window.innerHeight / 2 ? '-100%' : '0%'})`,
      }}
    >
      <div
        className='text-sm leading-normal text-primary-black dark:text-primary-gray-100 m-0'
        dangerouslySetInnerHTML={{ __html: htmlString }}
      />
    </div>
  );
}
