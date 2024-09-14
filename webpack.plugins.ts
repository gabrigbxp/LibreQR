import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin"
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin"

export const plugins = [
    new ForkTsCheckerWebpackPlugin({
        logger: "webpack-infrastructure",
    }),
    new ReactRefreshWebpackPlugin({
        overlay: {
            sockIntegration: "whm",
        },
    }),
]
