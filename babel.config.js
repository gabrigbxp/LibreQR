module.exports = (api) => {
    // This caches the Babel config
    api.cache.using(() => process.env.NODE_ENV)
    return {
        presets: [
            "@babel/preset-env",
            "@babel/preset-typescript",
            // Enable development transform of React with new automatic runtime
            ["@babel/preset-react", { development: true, runtime: "automatic" }],
        ],
        plugins: ["@babel/plugin-transform-runtime", "react-refresh/babel"],
    }
}
