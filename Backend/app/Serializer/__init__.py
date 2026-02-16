from flask_marshmallow import Marshmallow
from app.Models import Organization , Role , User
# from marshmallow import fields

ma = Marshmallow()
class OrganizationSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Organization
        load_instance = True
class RoleSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Role
        load_instance = True

class UserSchema(ma.SQLAlchemyAutoSchema):
    organization = ma.Nested(OrganizationSchema)
    # role = ma.Nested(RoleSchema)
    role = ma.Nested(RoleSchema, many=True)   # ✅ FIXED
    class Meta:
        model = User
        load_instance = True
        include_fk = True
        include_relationships = True
        exclude = ("password",)

