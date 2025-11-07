import path from "path"

const alias = {
    alias: {
        "@types": path.resolve(__dirname, "types"),
        "@ui": path.resolve(__dirname, "src", "ui"),
        "@utils": path.resolve(__dirname, "src", "utils"),
    },
}

export default alias
