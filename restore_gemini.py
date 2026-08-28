import os
import subprocess

CLASSIC_DIR = "C:\\Users\\CHANDRAKANT\\Downloads\\eduresources_classic"
ORIGINAL_DIR = "C:\\Users\\CHANDRAKANT\\Downloads\\eduresources"

def get_git_file(filepath, commit="dbed3f1"):
    result = subprocess.run(["git", "show", f"{commit}:{filepath}"], cwd=ORIGINAL_DIR, capture_output=True, text=True)
    return result.stdout

gemini_content = get_git_file("src/services/geminiService.ts")

with open(os.path.join(CLASSIC_DIR, "src", "services", "geminiService.ts"), "w", encoding="utf-8") as f:
    f.write(gemini_content)

print("Restored original geminiService.ts")
