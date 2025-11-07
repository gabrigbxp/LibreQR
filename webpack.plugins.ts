import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin"
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin"
import CopyWebpackPlugin from "copy-webpack-plugin"

const isDevelopment = process.env.NODE_ENV !== "production"

export const plugins = [
    new ForkTsCheckerWebpackPlugin({
        logger: "webpack-infrastructure",
    }),
    new CopyWebpackPlugin({
        patterns: [
            { from: "build/icon.ico", to: "icon.ico" },
            { from: "build/icon.png", to: "icon.png" },
            { from: "build/icon.icns", to: "icon.icns" },
        ],
    }),
    // Only use React Refresh in development
    isDevelopment &&
        new ReactRefreshWebpackPlugin({
            overlay: {
                sockIntegration: "whm",
            },
        }),
].filter(Boolean)
