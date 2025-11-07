/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin")
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin")

module.exports = (_env, argv) => {
    const isDevelopment = argv.mode !== "production"
    const baseUrl = isDevelopment ? "/" : "/LibreQR/"

    return {
        mode: isDevelopment ? "development" : "production",
        target: "web",
        entry: "./src/web.tsx",

        output: {
            path: path.resolve(__dirname, "dist-web"),
            filename: "bundle.[contenthash].js",
            clean: true,
            publicPath: baseUrl,
        },

        devtool: isDevelopment ? "eval-source-map" : "source-map",

        resolve: {
            extensions: [".ts", ".tsx", ".js", ".jsx", ".css", ".scss"],
            alias: {
                "@": path.resolve(__dirname, "src"),
                "@ui": path.resolve(__dirname, "src/ui"),
                "@utils": path.resolve(__dirname, "src/utils"),
                "@qr": path.resolve(__dirname, "src/qr"),
                "@types": path.resolve(__dirname, "types"),
            },
        },

        module: {
            rules: [
                {
                    test: /\.(ts|tsx)$/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: "babel-loader",
                            options: {
                                presets: ["@babel/preset-env", ["@babel/preset-react", { runtime: "automatic" }], "@babel/preset-typescript"],
                                plugins: ["@babel/plugin-transform-runtime", isDevelopment && "react-refresh/babel"].filter(Boolean),
                            },
                        },
                    ],
                },
                {
                    test: /\.css$/,
                    use: ["style-loader", "css-loader"],
                },
                {
                    test: /\.s[ac]ss$/,
                    use: ["style-loader", "css-loader", "sass-loader"],
                },
                {
                    test: /\.(png|jpe?g|gif|svg)$/i,
                    type: "asset/resource",
                },
                {
                    test: /\.(woff|woff2|eot|ttf|otf)$/i,
                    type: "asset/resource",
                },
            ],
        },

        plugins: [
            new HtmlWebpackPlugin({
                template: "./public/index.html",
                inject: true,
                templateParameters: {
                    BASE_URL: baseUrl,
                },
            }),
            new ForkTsCheckerWebpackPlugin(),
            isDevelopment && new ReactRefreshWebpackPlugin(),
        ].filter(Boolean),

        devServer: {
            port: 3000,
            hot: true,
            open: true,
            historyApiFallback: true,
            static: {
                directory: path.join(__dirname, "public"),
            },
        },

        optimization: {
            splitChunks: {
                chunks: "all",
                cacheGroups: {
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name: "vendors",
                        chunks: "all",
                    },
                },
            },
        },
    }
}
