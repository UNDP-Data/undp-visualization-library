interface Props {
  body: JSX.Element;
  xPos: number;
  yPos: number;
}

export function Tooltip(props: Props) {
  const { body, xPos, yPos } = props;
  return (
    <div
      style={{
        display: 'block',
        position: 'fixed',
        zIndex: '8',
        backgroundColor: 'var(--gray-200)',
        border: '1px solid var(--gray-300)',
        wordWrap: 'break-word',
        top: `${yPos < window.innerHeight / 2 ? yPos - 10 : yPos + 10}px`,
        left: `${xPos > window.innerWidth / 2 ? xPos - 10 : xPos + 10}px`,
        maxWidth: '24rem',
        transform: `translate(${
          xPos > window.innerWidth / 2 ? '-100%' : '0%'
        },${yPos > window.innerHeight / 2 ? '-100%' : '0%'})`,
      }}
    >
      {body}
    </div>
  );
}
