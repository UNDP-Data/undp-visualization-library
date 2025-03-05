import { SourcesDataType } from '../../Types';
import { FootNote } from '../Typography/FootNote';
import { Source } from '../Typography/Source';

interface Props {
  footNote?: string;
  sources?: SourcesDataType[];
  width?: number;
}

export function GraphFooter(props: Props) {
  const { sources, footNote, width } = props;
  if (
    (sources === undefined || (sources || []).length === 0) &&
    footNote === undefined
  )
    return null;
  return (
    <div
      className='flex gap-2 flex-col'
      style={{
        maxWidth: width ? `${width}px` : 'none',
      }}
      aria-label='Graph footer'
    >
      {sources ? <Source sources={sources} /> : null}
      {footNote ? <FootNote text={footNote} /> : null}
    </div>
  );
}
