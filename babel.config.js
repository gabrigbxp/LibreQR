module.exports = (api) => {
    // This caches the Babel config
    api.cache.using(() => process.env.NODE_ENV)
    const isDevelopment = process.env.NODE_ENV !== "production"

    return {
        presets: [
            "@babel/preset-env",
            "@babel/preset-typescript",
            // Enable development transform of React with new automatic runtime
            ["@babel/preset-react", { development: isDevelopment, runtime: "automatic" }],
        ],
        plugins: [
            "@babel/plugin-transform-runtime",
            // Only include react-refresh in development
            isDevelopment && "react-refresh/babel",
        ].filter(Boolean),
    }
}
