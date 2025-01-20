// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

defaultConfig.resolver.alias = {
  "@": "./StepsApp", // Adjust the path to point to the correct folder
};

module.exports = config;
