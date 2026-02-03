from sqlalchemy import Column, String, DateTime, Text, JSON, Integer, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.core.rbac import Role
from app.db.session import Base
import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username = Column(String, unique=True, index=True)
    password_hash = Column(String)
    role = Column(String)  # Use String for simplicity
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Case(Base):
    __tablename__ = "cases"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    external_patient_id = Column(String)
    encounter_id = Column(String)
    condition_focus = Column(String)
    state = Column(String)
    assigned_role = Column(String)
    risk_flags_json = Column(JSON)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

class CaseBundle(Base):
    __tablename__ = "case_bundles"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    case_id = Column(UUID(as_uuid=True), ForeignKey("cases.id"))
    bundle_json = Column(JSON)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class CaseArtifact(Base):
    __tablename__ = "case_artifacts"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    case_id = Column(UUID(as_uuid=True), ForeignKey("cases.id"))
    type = Column(String)
    version = Column(Integer, default=1)
    status = Column(String, default="DRAFT")
    content_json = Column(JSON)
    sources_used = Column(JSON)
    created_by = Column(String)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Task(Base):
    __tablename__ = "tasks"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    case_id = Column(UUID(as_uuid=True), ForeignKey("cases.id"))
    role = Column(String)
    title = Column(String)
    description = Column(Text)
    due_at = Column(DateTime)
    priority = Column(String, default="MED")
    status = Column(String, default="OPEN")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Approval(Base):
    __tablename__ = "approvals"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    case_id = Column(UUID(as_uuid=True), ForeignKey("cases.id"))
    artifact_id = Column(UUID(as_uuid=True), ForeignKey("case_artifacts.id"))
    approver_user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    approver_role = Column(String)
    decision = Column(String)
    notes = Column(Text)
    approved_at = Column(DateTime, default=datetime.datetime.utcnow)

class AuditEvent(Base):
    __tablename__ = "audit_events"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    case_id = Column(UUID(as_uuid=True), ForeignKey("cases.id"))
    event_type = Column(String)
    actor_type = Column(String)
    actor_id = Column(String)
    correlation_id = Column(String)
    event_json = Column(JSON)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)