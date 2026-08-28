import re

with open('src/pages/statsarthi/DiagnosticAssessment.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# We need to modify useEffect to read the role from statsarthi_profile
# and automatically call handleRoleSelect(role) if it exists.

effect_old = """  useEffect(() => {
    // Check if there's a selected role in localStorage (for returning users)
    const saved = localStorage.getItem('statsarthi_profile');
    if (saved) {
      // In a full implementation, we'd map profile to role. 
      // For now, we still show the role selector for demo purposes.
    }
  }, []);"""

effect_new = """  useEffect(() => {
    // Read the role from onboarding profile
    const saved = localStorage.getItem('statsarthi_profile');
    if (saved) {
      try {
        const profile = JSON.parse(saved);
        if (profile.designation) {
          const matchedRole = roleProfiles.find(r => r.id === profile.designation);
          if (matchedRole) {
            handleRoleSelect(matchedRole);
          }
        }
      } catch (e) {
        console.error("Failed to parse profile", e);
      }
    }
  }, []);"""

content = content.replace(effect_old, effect_new)

with open('src/pages/statsarthi/DiagnosticAssessment.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
