import { FootNote } from '../Typography/FootNote';
import { Source } from '../Typography/Source';

interface Props {
  sourceLink?: string;
  footNote?: string;
  source?: string;
}

export function GraphFooter(props: Props) {
  const { source, footNote, sourceLink } = props;

  return (
    <div className='flex-div gap-03' style={{ flexDirection: 'column' }}>
      {source ? <Source text={source} link={sourceLink} /> : null}
      {footNote ? <FootNote text={footNote} /> : null}
    </div>
  );
}
