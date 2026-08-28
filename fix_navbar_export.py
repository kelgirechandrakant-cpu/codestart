import os

CLASSIC_DIR = "C:\\Users\\CHANDRAKANT\\Downloads\\eduresources_classic"
filepath = os.path.join(CLASSIC_DIR, "src", "components", "Navbar.tsx")

with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace("const Navbar = () => {", "export const Navbar = () => {")
content = content.replace("export default Navbar;", "")

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)

# Also fix App.tsx which was using default import
app_filepath = os.path.join(CLASSIC_DIR, "src", "App.tsx")
with open(app_filepath, "r", encoding="utf-8") as f:
    app_content = f.read()
app_content = app_content.replace('import Navbar from "@/components/Navbar";', 'import { Navbar } from "@/components/Navbar";')
with open(app_filepath, "w", encoding="utf-8") as f:
    f.write(app_content)

print("Fixed Navbar export")
