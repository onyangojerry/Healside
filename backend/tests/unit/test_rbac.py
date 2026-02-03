from app.core.rbac import has_permission, Role

def test_has_permission():
    assert has_permission(Role.ADMIN, [Role.ADMIN])
    assert not has_permission(Role.VIEWER, [Role.ADMIN])