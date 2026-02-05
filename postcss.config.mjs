const config = {
  plugins: {
    "@tailwindcss/postcss": {},
    "postcss-preset-env": {
      stage: 3,
      features: {
        "okls-colors": true,
        "custom-properties": true,
      },
    },
    autoprefixer: {},
  },
};

export default config;
