import prompts from "prompts";
import { execa } from "execa";

export async function run() {
    const { name } = await prompts({
        type: "text",
        name: "name",
        message: "Project name:",
        validate: value => value ? true : "Project name is required"
    });

    if (!name.trim()) {
        console.log("Aborted.");
        return;
    }

    console.log(`Creating Vite project: ${name}`);

    await execa(
        "npm",
        ["create", "vite@latest", name],
        { stdio: "inherit" }
    );
}