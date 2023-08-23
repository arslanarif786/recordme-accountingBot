// const { defineConfig } = require("@vue/cli-service");
// const Dotenv = require('dotenv-webpack');
// module.exports = defineConfig({
//   transpileDependencies: ["vuetify"],
//   configureWebpack: {
//     plugins: [
//       new Dotenv()
//     ]
//   }
// });

const Dotenv = require('dotenv-webpack');
module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  configureWebpack: {
    plugins: [
      new Dotenv()
    ]
  }
}

