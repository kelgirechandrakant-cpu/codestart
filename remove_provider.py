import os

CLASSIC_DIR = "C:\\Users\\CHANDRAKANT\\Downloads\\eduresources_classic"
filepath = os.path.join(CLASSIC_DIR, "src", "App.tsx")

with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace('import { SupabaseProvider } from "@/integrations/supabase/provider";\n', '')
content = content.replace('<SupabaseProvider>', '')
content = content.replace('</SupabaseProvider>', '')

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)

print("Removed SupabaseProvider")
