import { FileText, Folder } from 'lucide-react';

interface Props {
  type: 'folder' | 'doc';
  text: string;
}

function NavEl(props: Props) {
  const { type, text } = props;
  return (
    <div className='flex-div gap-03'>
      {type === 'doc' ? (
        <FileText size={16} strokeWidth={1} />
      ) : (
        <Folder size={16} strokeWidth={1} />
      )}
      <p className='undp-typography small-font margin-bottom-04'>{text}</p>
    </div>
  );
}

export default NavEl;
