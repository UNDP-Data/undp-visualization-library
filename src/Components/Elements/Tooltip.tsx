/* eslint-disable react/no-danger */
import { CSSObject } from '../../Types';
import { string2HTML } from '../../Utils/string2HTML';
import { UNDPColorModule } from '../ColorPalette';

interface Props {
  body: string;
  xPos: number;
  yPos: number;
  data: any;
  rtl?: boolean;
  language?: 'ar' | 'he' | 'en';
  mode: 'dark' | 'light';
  backgroundStyle?: CSSObject;
}

export function Tooltip(props: Props) {
  const {
    body,
    xPos,
    yPos,
    data,
    rtl,
    language,
    mode,
    backgroundStyle = {
      backgroundColor: UNDPColorModule[mode].grays['gray-200'],
      border: `1px solid ${UNDPColorModule[mode].grays['gray-300']}`,
      maxWidth: '24rem',
      padding: '0.5rem',
    },
  } = props;
  const htmlString = string2HTML(body, data);
  return (
    <div
      className='block fixed z-[1000]'
      style={{
        ...backgroundStyle,
        wordWrap: 'break-word',
        top: `${yPos < window.innerHeight / 2 ? yPos - 10 : yPos + 10}px`,
        left: `${xPos > window.innerWidth / 2 ? xPos - 10 : xPos + 10}px`,
        transform: `translate(${
          xPos > window.innerWidth / 2 ? '-100%' : '0%'
        },${yPos > window.innerHeight / 2 ? '-100%' : '0%'})`,
      }}
    >
      <div
        className={`${
          rtl
            ? `font-sans-${language || 'ar'} text-right`
            : 'font-sans text-left'
        } text-sm leading-normal ${
          mode === 'dark' ? 'text-primary-white' : 'text-primary-gray-700'
        } m-0 undp-viz-tooltip`}
        dangerouslySetInnerHTML={{ __html: htmlString }}
      />
    </div>
  );
}
