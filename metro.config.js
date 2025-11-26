/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-require-imports */
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

const config = mergeConfig(getDefaultConfig(__dirname), {
  resolver: {
    extraNodeModules: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});

module.exports = withNativeWind(config, { input: './global.css' });
