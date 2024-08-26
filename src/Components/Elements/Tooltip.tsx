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
}

export function Tooltip(props: Props) {
  const { body, xPos, yPos, data, rtl, language } = props;
  const htmlString = string2HTML(body, data);
  return (
    <div
      style={{
        display: 'block',
        position: 'fixed',
        zIndex: '8',
        backgroundColor: UNDPColorModule.grays['gray-200'],
        border: `1px solid ${UNDPColorModule.grays['gray-300']}`,
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
        }undp-viz-tooltip`}
        style={{ margin: 0, padding: 'var(--spacing-07)' }}
        dangerouslySetInnerHTML={{ __html: htmlString }}
      />
    </div>
  );
}
