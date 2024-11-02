import { SourcesDataType } from '../../Types';
import { FootNote } from '../Typography/FootNote';
import { Source } from '../Typography/Source';

interface Props {
  footNote?: string;
  sources?: SourcesDataType[];
  width?: number;
  rtl?: boolean;
  language?: 'ar' | 'he' | 'en';
  mode: 'dark' | 'light';
}

export function GraphFooter(props: Props) {
  const { sources, footNote, width, rtl, language, mode } = props;
  if (
    (sources === undefined || (sources || []).length === 0) &&
    footNote === undefined
  )
    return null;
  return (
    <div
      style={{
        display: 'flex',
        gap: '0.5rem',
        flexDirection: 'column',
        maxWidth: width || 'none',
      }}
    >
      {sources ? (
        <Source sources={sources} rtl={rtl} language={language} mode={mode} />
      ) : null}
      {footNote ? (
        <FootNote text={footNote} rtl={rtl} language={language} mode={mode} />
      ) : null}
    </div>
  );
}
