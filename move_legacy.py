import os
import shutil

ROOT_DIR = "C:\\Users\\CHANDRAKANT\\Downloads\\eduresources"
LEGACY_DIR = os.path.join(ROOT_DIR, "_legacy_eduresources")

# Create directories
dirs_to_create = [
    "pages",
    "components",
    "data",
    "types",
    "integrations"
]

for d in dirs_to_create:
    os.makedirs(os.path.join(LEGACY_DIR, d), exist_ok=True)

# Define paths to move
to_move = {
    "pages": [
        "About.tsx", "Admin.tsx", "AITutor.tsx", "Assignments.tsx", "Auth.tsx",
        "AuthCallback.tsx", "Contact.tsx", "Index.tsx", "Notes.tsx", "OTPAuth.tsx",
        "PracticeDirectory.tsx", "PrivacyPolicy.tsx", "ProblemArena.tsx", "PYQs.tsx",
        "Resources.tsx", "UserAuth.tsx"
    ],
    "components": [
        "admin", "practice", "study-assistant", "DocumentViewer.tsx",
        "ResourceBrowser.tsx", "ResourceCard.tsx", "StudyAssistant.tsx"
    ],
    "data": [
        "codingQuestions.ts"
    ],
    "types": [
        "coding.ts"
    ],
    "integrations": [
        "supabase"
    ]
}

# Move items
for category, items in to_move.items():
    for item in items:
        src_path = os.path.join(ROOT_DIR, "src", category, item)
        dst_path = os.path.join(LEGACY_DIR, category, item)
        
        if os.path.exists(src_path):
            print(f"Moving {src_path} -> {dst_path}")
            shutil.move(src_path, dst_path)
        else:
            print(f"Not found: {src_path}")

print("Done moving files.")
