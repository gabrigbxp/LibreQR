import fs from "fs"
import path from "path"

const filePath = path.join(__dirname, "src", "ui", "env.json")
process.env.NODE_ENV = "development"

fs.writeFile(filePath, JSON.stringify(process.env, null, 2), (err) => {
    if (err) {
        console.error("Error al escribir el archivo:", err)
    } else {
        console.log("Archivo JSON con process.env creado exitosamente.")
    }
})
