/* eslint-disable react/no-danger */
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
}

export function Tooltip(props: Props) {
  const { body, xPos, yPos, data, rtl, language, mode } = props;
  const htmlString = string2HTML(body, data);
  return (
    <div
      style={{
        display: 'block',
        position: 'fixed',
        zIndex: '8',
        backgroundColor: UNDPColorModule[mode].grays['gray-200'],
        border: `1px solid ${UNDPColorModule[mode].grays['gray-300']}`,
        wordWrap: 'break-word',
        top: `${yPos < window.innerHeight / 2 ? yPos - 10 : yPos + 10}px`,
        left: `${xPos > window.innerWidth / 2 ? xPos - 10 : xPos + 10}px`,
        maxWidth: '24rem',
        transform: `translate(${
          xPos > window.innerWidth / 2 ? '-100%' : '0%'
        },${yPos > window.innerHeight / 2 ? '-100%' : '0%'})`,
        padding: '0.5rem',
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
