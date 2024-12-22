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
      style={{
        ...backgroundStyle,
        display: 'block',
        position: 'fixed',
        zIndex: '1000',
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
          rtl ? `undp-viz-tooltip-${language || 'ar'} ` : ''
        }undp-viz-tooltip${mode === 'dark' ? ' undp-viz-tooltip-dark' : ''}`}
        style={{ margin: 0 }}
        dangerouslySetInnerHTML={{ __html: htmlString }}
      />
    </div>
  );
}
