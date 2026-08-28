import os

CLASSIC_DIR = "C:\\Users\\CHANDRAKANT\\Downloads\\eduresources_classic"
filepath = os.path.join(CLASSIC_DIR, "src", "App.tsx")

with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace('import StudyAssistant from "@/components/StudyAssistant";', 'import { StudyAssistant } from "@/components/StudyAssistant";')
content = content.replace('import Footer from "@/components/Footer";', 'import { Footer } from "@/components/Footer";')

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)

print("Fixed App.tsx imports")
