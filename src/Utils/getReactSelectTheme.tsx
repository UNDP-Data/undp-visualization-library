import { UNDPColorModule } from '../Components/ColorPalette';

export function getReactSelectTheme(theme: any, mode?: 'light' | 'dark') {
  return {
    ...theme,
    borderRadius: 0,
    spacing: {
      ...theme.spacing,
      baseUnit: 4,
      menuGutter: 2,
      controlHeight: 48,
    },
    colors: {
      ...theme.colors,
      danger: UNDPColorModule[mode || 'light'].alerts.darkRed,
      dangerLight: UNDPColorModule[mode || 'light'].grays['gray-400'],
      neutral10: UNDPColorModule[mode || 'light'].grays['gray-400'],
      primary50: UNDPColorModule[mode || 'light'].primaryColors['blue-400'],
      primary25: UNDPColorModule[mode || 'light'].grays['gray-200'],
      primary: UNDPColorModule[mode || 'light'].primaryColors['blue-600'],
    },
  };
}
