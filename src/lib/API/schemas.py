from pydantic import BaseModel
class ConversationOut(BaseModel):
    id: int
    user: str
    assistant: str
    dataset_id: int

    class Config:
        orm_mode = True  # чтобы Pydantic мог читать из ORM-объектов SQLAlchemy

class ConversationSchema(BaseModel):
    id: int
    user: str
    assistant: str
    dataset_id: int

    class Config:
        orm_mode = True
