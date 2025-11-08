module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./"],
          alias: {
            "@": "./",
          },
        },
      ],
      "@babel/plugin-proposal-export-namespace-from",
      "react-native-worklets/plugin",
    ],
  };
};
