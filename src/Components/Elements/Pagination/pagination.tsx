/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from '../../Icons/Icons';
import { UNDPColorModule } from '../../ColorPalette';

function PaginationUnit({ ...props }: React.ComponentProps<'nav'>) {
  return (
    <nav
      {...props}
      role='navigation'
      aria-label='pagination'
      style={{
        width: '100%',
        display: 'flex',
        marginLeft: 'auto',
        justifyContent: 'center',
        marginRight: 'auto',
      }}
    />
  );
}
PaginationUnit.displayName = 'PaginationUnit';

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<'ul'>
>(({ ...props }, ref) => (
  <ul
    {...props}
    ref={ref}
    style={{
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: '0.25rem',
      listStyleType: 'none',
    }}
  />
));
PaginationContent.displayName = 'PaginationContent';

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<'li'>
>(({ ...props }, ref) => (
  <li {...props} ref={ref} className='undp-pagination-li' />
));
PaginationItem.displayName = 'PaginationItem';

function PaginationLink({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  // eslint-disable-next-line react/prop-types
  const style = props.style ? { ...props.style } : {};
  return (
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    <button
      {...props}
      type='button'
      style={{
        padding: '1rem',
        fontSize: '1rem',
        borderRadius: '999px',
        border: 0,
        ...style,
      }}
    >
      {children}
    </button>
  );
}
PaginationLink.displayName = 'PaginationLink';

interface PaginationIconProps
  extends React.ComponentProps<typeof PaginationLink> {
  mode?: 'light' | 'dark';
}

function PaginationPrevious({ mode = 'light', ...props }: PaginationIconProps) {
  return (
    <PaginationLink
      {...props}
      aria-label='Go to previous page'
      style={{
        width: '48px',
        height: '48px',
        padding: 0,
        backgroundColor: UNDPColorModule[mode].grays.black,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <ChevronLeft mode={mode} />
    </PaginationLink>
  );
}
PaginationPrevious.displayName = 'PaginationPrevious';

function PaginationNext({ mode = 'light', ...props }: PaginationIconProps) {
  return (
    <PaginationLink
      {...props}
      aria-label='Go to next page'
      style={{
        width: '48px',
        height: '48px',
        padding: 0,
        backgroundColor: UNDPColorModule[mode].grays.black,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <ChevronRight mode={mode} />
    </PaginationLink>
  );
}
PaginationNext.displayName = 'PaginationNext';

function PaginationEllipsis({ mode = 'light', ...props }: PaginationIconProps) {
  return (
    <span
      {...props}
      aria-hidden
      style={{
        display: 'flex',
        height: '36px',
        width: '36px',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <MoreHorizontal mode={mode} />
    </span>
  );
}
PaginationEllipsis.displayName = 'PaginationEllipsis';

export {
  PaginationUnit,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
};
