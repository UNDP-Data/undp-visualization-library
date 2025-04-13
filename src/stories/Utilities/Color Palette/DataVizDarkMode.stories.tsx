import type { Meta } from '@storybook/react';
import { Palette } from './Palette Component';

export default {
  title: 'Utilities/Colors/Data viz dark mode',
} as Meta;

export function Datavizdarkmode() {
  return <Palette mode='dark' />;
}
