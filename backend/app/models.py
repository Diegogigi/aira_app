
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Enum, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base
import enum


class RoleEnum(str, enum.Enum):
    user = "user"
    caregiver = "caregiver"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)

    profiles = relationship("Profile", back_populates="owner")


class Profile(Base):
    __tablename__ = "profiles"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    diagnosis = Column(String, nullable=True)
    role = Column(Enum(RoleEnum), default=RoleEnum.user)
    owner_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="profiles")
    treatments = relationship("TreatmentPlan", back_populates="profile")
    inhalations = relationship("InhalationLog", back_populates="profile")
    symptoms = relationship("SymptomLog", back_populates="profile")
    events = relationship("Event", back_populates="profile")


class TreatmentPlan(Base):
    __tablename__ = "treatment_plans"

    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("profiles.id"))
    medication_name = Column(String, nullable=False)
    medication_type = Column(String, nullable=True)
    puffs_per_dose = Column(Integer, default=1)
    times_per_day = Column(Integer, default=1)
    schedule_json = Column(Text, nullable=True)
    active = Column(Boolean, default=True)

    profile = relationship("Profile", back_populates="treatments")
    inhalations = relationship("InhalationLog", back_populates="treatment")


class InhalationLog(Base):
    __tablename__ = "inhalation_logs"

    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("profiles.id"))
    treatment_id = Column(Integer, ForeignKey("treatment_plans.id"), nullable=True)
    medication_name = Column(String, nullable=False)
    puffs = Column(Integer, default=1)
    used_chamber = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    profile = relationship("Profile", back_populates="inhalations")
    treatment = relationship("TreatmentPlan", back_populates="inhalations")


class SymptomLog(Base):
    __tablename__ = "symptom_logs"

    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("profiles.id"))
    day = Column(DateTime, default=datetime.utcnow)
    level = Column(Integer, default=0)
    notes = Column(Text, nullable=True)
    triggers = Column(Text, nullable=True)

    profile = relationship("Profile", back_populates="symptoms")


class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("profiles.id"))
    event_type = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    occurred_at = Column(DateTime, default=datetime.utcnow)

    profile = relationship("Profile", back_populates="events")
