const fs = require("fs")
const { execSync } = require("child_process")

const preCommitHookPath = ".husky/pre-commit"

if (!fs.existsSync(preCommitHookPath)) {
    try {
        execSync("npx husky init", { stdio: "inherit" })

        fs.writeFileSync(preCommitHookPath, "npx lint-staged\n", { mode: 0o777 })

        console.log("Husky initialized and pre-commit hook created.")
    } catch (error) {
        console.error("Failed to set up Husky or pre-commit hook:", error)
        process.exit(1)
    }
}
