import { GraphDescription } from '../Typography/GraphDescription';
import { GraphTitle } from '../Typography/GraphTitle';

interface Props {
  graphTitle?: string;
  graphDescription?: string;
}

export function GraphHeader(props: Props) {
  const { graphTitle, graphDescription } = props;

  return (
    <div className='flex-div gap-03' style={{ flexDirection: 'column' }}>
      {graphTitle ? <GraphTitle text={graphTitle} /> : null}
      {graphDescription ? <GraphDescription text={graphDescription} /> : null}
    </div>
  );
}
