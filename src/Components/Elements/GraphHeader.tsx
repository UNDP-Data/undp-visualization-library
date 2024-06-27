import { GraphDescription } from '../Typography/GraphDescription';
import { GraphTitle } from '../Typography/GraphTitle';

interface Props {
  graphTitle?: string;
  graphDescription?: string;
  width?: number;
}

export function GraphHeader(props: Props) {
  const { graphTitle, graphDescription, width } = props;

  return (
    <div
      className='flex-div gap-03'
      style={{ flexDirection: 'column', maxWidth: width || 'none' }}
    >
      {graphTitle ? <GraphTitle text={graphTitle} /> : null}
      {graphDescription ? <GraphDescription text={graphDescription} /> : null}
    </div>
  );
}
