import enum
from sqlalchemy import Column, String, Boolean, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.types import DateTime

from app.core.database import Base

class UserRole(str, enum.Enum):
    employee = "employee"
    hr = "hr"
    admin = "admin"

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    employee_id = Column(String(50), unique=True, nullable=False)
    full_name = Column(String(150), nullable=False)
    email = Column(String(150), unique=True, nullable=False)
    idpsubjectid = Column(String(255), unique=True, nullable=False)
    role = Column(Enum(UserRole), nullable=False, default=UserRole.employee)
    designation = Column(String(100), nullable=True)
    profile_photo_url = Column(String, nullable=True) # TEXT in pg
    bio = Column(String(500), nullable=True)
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
