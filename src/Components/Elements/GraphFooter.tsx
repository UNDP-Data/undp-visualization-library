import { FootNote } from '../Typography/FootNote';
import { Source } from '../Typography/Source';

interface Props {
  sourceLink?: string;
  footNote?: string;
  source?: string;
  width?: number;
  rtl?: boolean;
  language?: 'ar' | 'he' | 'en';
  mode: 'dark' | 'light';
}

export function GraphFooter(props: Props) {
  const { source, footNote, sourceLink, width, rtl, language, mode } = props;
  if (source === undefined && footNote === undefined) return null;
  return (
    <div
      style={{
        display: 'flex',
        gap: '0.5rem',
        flexDirection: 'column',
        maxWidth: width || 'none',
      }}
    >
      {source ? (
        <Source
          text={source}
          link={sourceLink}
          rtl={rtl}
          language={language}
          mode={mode}
        />
      ) : null}
      {footNote ? (
        <FootNote text={footNote} rtl={rtl} language={language} mode={mode} />
      ) : null}
    </div>
  );
}
