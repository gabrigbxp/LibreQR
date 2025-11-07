import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin"
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin"

const isDevelopment = process.env.NODE_ENV !== "production"

export const plugins = [
    new ForkTsCheckerWebpackPlugin({
        logger: "webpack-infrastructure",
    }),
    // Only use React Refresh in development
    isDevelopment &&
        new ReactRefreshWebpackPlugin({
            overlay: {
                sockIntegration: "whm",
            },
        }),
].filter(Boolean)
