import path from "path"

const alias = {
    alias: {
        "@types": path.resolve(__dirname, "types"),
        "@ui": path.resolve(__dirname, "src", "ui"),
    },
}

export default alias
