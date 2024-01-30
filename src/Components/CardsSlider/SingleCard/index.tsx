import styled from 'styled-components';

interface Props {
  contentEl: JSX.Element;
}

const StatCardsEl = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  flex-grow: 1;
  flex-basis: 22.5rem;
  min-width: 22.5rem;
  min-height: 22.5rem;
  background-color: var(--gray-200);
  justify-content: space-between;
  font-size: 1.25rem;
  color: var(--black);
  transition: 300ms all;
  height: auto !important;
  scroll-snap-align: start;
`;

export function SingleCardEl(props: Props) {
  const { contentEl } = props;
  return <StatCardsEl>{contentEl}</StatCardsEl>;
}
