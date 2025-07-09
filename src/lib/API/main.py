from fastapi import FastAPI, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware

from database import SessionLocal
from models import Conversation
from schemas import ConversationOut  # pydantic-схема для ответа

app = FastAPI()

# Add CORS middleware with permissive settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,  # Allow credentials
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

# Dependency для получения сессии БД
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/conversations/", response_model=List[ConversationOut])
def get_conversations(
    dataset_id: int = Query(..., description="ID набора данных для фильтрации"),
    search: Optional[str] = Query(None, description="Текст для поиска в user и assistant"),
    db: Session = Depends(get_db)
):
    query = db.query(Conversation).filter(Conversation.dataset_id == dataset_id)
    if search:
        like_pattern = f"%{search}%"
        query = query.filter(
            (Conversation.user.ilike(like_pattern)) |
            (Conversation.assistant.ilike(like_pattern))
        )
    return query.all()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5005)
