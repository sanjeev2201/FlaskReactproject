from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()
user_roles = db.Table(
                "user_roles",
                db.Column("user_id", db.Integer, db.ForeignKey("users.id"), primary_key=True),
                db.Column("role_id", db.Integer, db.ForeignKey("roles.id"), primary_key=True),
                )

class Organization(db.Model):
    __tablename__ = "organizations"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    users = db.relationship("User", back_populates="organization")
    status = db.Column(db.Boolean, default=True)
    def __repr__(self):
        return f"<Organization {self.name}>"



class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    password = db.Column(db.String(255), nullable=False)

    # One Organization
    organization_id = db.Column(
        db.Integer,
        db.ForeignKey("organizations.id"),
        nullable=False
    )

    organization = db.relationship(
        "Organization",
        back_populates="users"
    )

    # Multiple Roles
    roles = db.relationship(
        "Role",
        secondary=user_roles,
        back_populates="users"
    )
    status = db.Column(db.Boolean, default=True)
    def has_role(self, role_name):
        return role_name in [role.name for role in self.roles]

    def __repr__(self):
        return f"<User {self.username}>"
class Role(db.Model):
    __tablename__ = "roles"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    users = db.relationship("User",secondary=user_roles,back_populates="roles")
    status = db.Column(db.Boolean, default=True)
    def __repr__(self):
        return f"<Role {self.name}>"
