import os
import shutil

ROOT_DIR = "C:\\Users\\CHANDRAKANT\\Downloads\\eduresources"
LEGACY_DIR = os.path.join(ROOT_DIR, "_legacy_eduresources")

to_move = [
    "Navbar.tsx",
    "Footer.tsx",
    "NavLink.tsx",
    "ErrorBoundary.tsx"
]

for item in to_move:
    src_path = os.path.join(ROOT_DIR, "src", "components", item)
    dst_path = os.path.join(LEGACY_DIR, "components", item)
    if os.path.exists(src_path):
        print(f"Moving {src_path} -> {dst_path}")
        shutil.move(src_path, dst_path)

print("Moved remaining legacy components.")
