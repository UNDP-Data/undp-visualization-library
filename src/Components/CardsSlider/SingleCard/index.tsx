import { UNDPColorModule } from '../../ColorPalette';

interface Props {
  contentEl: JSX.Element;
}

export function SingleCardEl(props: Props) {
  const { contentEl } = props;
  return (
    <div
      style={{
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: '0',
        flexGrow: '1',
        flexBasis: '22.5rem',
        minWidth: '22.5rem',
        minHeight: '22.5rem',
        backgroundColor: UNDPColorModule.grays['gray-200'],
        justifyContent: 'space-between',
        fontSize: '1.25rem',
        color: UNDPColorModule.grays.black,
        transition: '300ms all',
        height: 'auto',
        scrollSnapAlign: 'start',
      }}
    >
      {contentEl}
    </div>
  );
}
