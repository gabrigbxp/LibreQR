import fs from "fs"
import path from "path"

const filePath = path.join(__dirname, "src", "ui", ".env.json")

if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = "development"
}

fs.writeFile(filePath, JSON.stringify(process.env, null, 2), (err) => {
    if (err) {
        console.error("Error writing file:", err)
    } else {
        console.log(`JSON file with process.env created successfully (NODE_ENV: ${process.env.NODE_ENV}).`)
    }
})
