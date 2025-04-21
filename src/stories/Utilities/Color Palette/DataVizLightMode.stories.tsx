import type { Meta } from '@storybook/react';

import { Palette } from './Palette Component';

export default { title: 'Utilities/Colors/Data viz light theme' } as Meta;

export function Datavizlightmode() {
  return <Palette theme='light' />;
}
