import { FootNote } from '../Typography/FootNote';
import { Source } from '../Typography/Source';

interface Props {
  sourceLink?: string;
  footNote?: string;
  source?: string;
  width?: number;
}

export function GraphFooter(props: Props) {
  const { source, footNote, sourceLink, width } = props;
  if (source === undefined && footNote === undefined) return null;
  return (
    <div
      className='flex-div gap-03'
      style={{ flexDirection: 'column', maxWidth: width || 'none' }}
    >
      {source ? <Source text={source} link={sourceLink} /> : null}
      {footNote ? <FootNote text={footNote} /> : null}
    </div>
  );
}
