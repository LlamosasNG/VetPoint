const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);
const {
  resolver: {sourceExts, assetExts},
} = defaultConfig;
/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  transformer: {
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
  resolver: {
    assetExts: assetExts.filter(ext => ext !== 'svg'),
    sourceExts: [...sourceExts, 'svg'],
    alias: {
      '@': './src',
      '@components': './src/components',
      '@screens': './src/screens',
      '@hooks': './src/hooks',
      '@context': './src/context',
      '@navigation': './src/navigation',
      '@services': './src/services',
      '@utils': './src/utils',
      '@types': './src/types',
      '@assets': './src/assets',
      '@public': './public',
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
