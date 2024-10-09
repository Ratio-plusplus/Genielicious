/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const COLORS = {
  light: {
    blue: "2C3E50",
    champagne: "F4D1AE",
    ghost: "EBEEFA",
    gold: "ED9A1C", 
    yellow: "F0C016",
    raisin: "272725",

    text: "#341C02", //dark brown
    background: "#F5EEDC", //cream
    tomato: "#FF6347",
    olive: "#708328",
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};
