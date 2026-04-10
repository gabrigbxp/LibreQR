import type { Configuration } from "webpack"

import { rules } from "./webpack.rules"
import { plugins } from "./webpack.plugins"
import alias from "./alias"

// Filter out native module loaders (node-loader, asset-relocator-loader)
// They inject __dirname which is not available in the renderer process
const rendererRules = rules.filter((rule) => {
    if (!rule || typeof rule !== "object" || !("use" in rule)) return true
    const use = rule.use
    if (use === "node-loader") return false
    if (typeof use === "object" && use !== null && "loader" in use && use.loader === "@vercel/webpack-asset-relocator-loader") return false
    return true
})

rendererRules.push({
    test: /\.css$/,
    use: [{ loader: "style-loader" }, { loader: "css-loader" }],
})

export const rendererConfig: Configuration = {
    module: {
        rules: rendererRules,
    },
    plugins,
    resolve: {
        extensions: [".js", ".ts", ".jsx", ".tsx", ".css"],
        ...alias,
    },
}
