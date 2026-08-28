import shutil
import os
ROOT_DIR = "C:\\Users\\CHANDRAKANT\\Downloads\\eduresources"
src = os.path.join(ROOT_DIR, "_legacy_eduresources", "components", "ErrorBoundary.tsx")
dst = os.path.join(ROOT_DIR, "src", "components", "ErrorBoundary.tsx")
shutil.move(src, dst)
print("Restored ErrorBoundary.tsx")
