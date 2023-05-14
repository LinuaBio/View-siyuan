const path = require("path");
const fs = require("fs");
const webpack = require("webpack");
const {EsbuildPlugin} = require("esbuild-loader");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");
// const ZipPlugin = require("zip-webpack-plugin");
const { VueLoaderPlugin } = require("vue-loader/dist/index");
const outPath = "E:/SiyuanSpace/data/plugins/Encryption";

module.exports = (env, argv) => {
    const isPro = argv.mode === "production";
    const plugins = [
        new VueLoaderPlugin(),
        new MiniCssExtractPlugin({
            filename: isPro ? "index.css" : "index.css",
        })
    ];
    let entry = {
        "index": "./src/index.ts",
    };
    if (isPro) {
        entry = {
            "index": "./src/index.ts",
        };
        plugins.push(new webpack.BannerPlugin({
            banner: () => {
                return fs.readFileSync("LICENSE").toString();
            },
        }));
        plugins.push(new CopyPlugin({
            patterns: [
                {from: "preview.png", to: "./"+outPath+"/"},
                {from: "icon.png", to: "./"+outPath+"/"},
                {from: "README*.md", to: "./"+outPath+"/"},
                {from: "plugin.json", to: "./"+outPath+"/"},
                {from: "src/i18n/", to: "./"+outPath+"/i18n/"},
            ],
        }));
        // plugins.push(new ZipPlugin({
        //     filename: "package.zip",
        //     algorithm: "gzip",
        //     include: [/dist/],
        //     pathMapper: (assetPath) => {
        //         return assetPath.replace(outPath+"/", "");
        //     },
        // }));
    }
    return {
        mode: argv.mode || "development",
        watch: !isPro,
        devtool: isPro ? false : "eval",
        output: {
            filename: "[name].js",
            // path: path.resolve(__dirname),
            path: outPath,
            libraryTarget: "commonjs2",
            library: {
                type: "commonjs2",
            },
        },
        externals: {
            siyuan: "siyuan",
        },
        entry,
        optimization: {
            minimize: true,
            minimizer: [
                new EsbuildPlugin(),
            ],
        },
        resolve: {
            extensions: [".ts", ".scss"],
        },
        module: {
            rules: [
                {
                    test: /\.ts(x?)$/,
                    include: [path.resolve(__dirname, "src")],
                    use: [
                        {
                            loader: "esbuild-loader",
                            options: {
                                target: "es6",
                            }
                        },
                    ],
                },
                {
                    test: /\.scss$/,
                    include: [path.resolve(__dirname, "src")],
                    use: [
                        MiniCssExtractPlugin.loader,
                        {
                            loader: "css-loader", // translates CSS into CommonJS
                        },
                        {
                            loader: "sass-loader", // compiles Sass to CSS
                        },
                    ],
                },
                {
                    test: /\.vue$/,
                    loader: "vue-loader"
                }
            ],
        },
        plugins,
    };
};
