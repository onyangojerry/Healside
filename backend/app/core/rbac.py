from enum import Enum

class Role(str, Enum):
    ADMIN = "admin"
    CLINICIAN = "clinician"
    RN = "rn"
    SCHEDULER = "scheduler"
    PHARMACIST = "pharmacist"
    VIEWER = "viewer"

def has_permission(user_role: Role, required_roles: list[Role]) -> bool:
    return user_role in required_roles

# Approval permissions
APPROVAL_PERMISSIONS = {
    "summary": [Role.CLINICIAN],
    "medrec": [Role.PHARMACIST],
    "outreach": [Role.CLINICIAN],
    "scheduling": [Role.SCHEDULER],
}