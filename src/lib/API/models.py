from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import declarative_base
from database import Base 
Base = declarative_base()
from sqlalchemy import Column, Integer, Text
from database import Base

class Conversation(Base):
    __tablename__ = "conversations"

    id = Column(Integer, primary_key=True, index=True)
    dataset_id = Column(Integer, index=True)
    user = Column(Text)
    assistant = Column(Text)
