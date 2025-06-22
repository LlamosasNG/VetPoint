module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
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
    ],
  ],
};
