import logging
from fastapi import FastAPI, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Path
from database import SessionLocal
from models import Conversation
from schemas import ConversationOut, ConversationUpdate  # pydantic-схема для ответа
import re
import json
# from langdetect import detect ,LangDetectException
# import fasttext
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
        
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5005)

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



# model = fasttext.load_model("C:/Users/user/Downloads/lid.176.bin")

# def is_russian(text: str, threshold=0.9) -> bool:
#     try:
#         labels, probs = model.predict(text.strip().replace("\n", " "))
#         # labels и probs — списки, берем первый label и confidence
#         return labels[0] == '__label__ru' and probs[0] >= threshold
#     except Exception as e:
#         logging.error(f"Ошибка определения языка: {e}")
#         return False

# @app.get("/export-conversations-with-russian/")
# def export_conversations_with_russian(
#     dataset_id: int = Query(...),
#     db: Session = Depends(get_db)
# ):
#     conversations = db.query(Conversation).filter(Conversation.dataset_id == dataset_id).all()

#     filtered = []
#     for conv in conversations:
#         combined_text = f"{conv.user or ''} {conv.assistant or ''}"
#         if is_russian(combined_text):
#             filtered.append({
#                 "id": conv.id,
#                 "user": conv.user,
#                 "assistant": conv.assistant,
#                 "dataset_id": conv.dataset_id
#             })

#     output_path = "conversations_with_russian.json"
#     with open(output_path, "w", encoding="utf-8") as f:
#         json.dump(filtered, f, ensure_ascii=False, indent=4)

#     return {"message": f"Сохранено {len(filtered)} conversations с русским языком в {output_path}"}


# # APPROVED
import langid

def is_russian(text: str) -> bool:
    try:
        return langid.classify(text)[0] == 'ru'
    except:
        return False

# @app.get("/export-conversations-with-russian/")
# def export_conversations_with_russian(
#     dataset_id: int = Query(...),
#     db: Session = Depends(get_db)
# ):
#     conversations = db.query(Conversation).filter(Conversation.dataset_id == dataset_id).all()

#     filtered = []
#     for conv in conversations:
#         combined_text = f"{conv.user or ''} {conv.assistant or ''}"
#         if is_russian(combined_text):
#             filtered.append({
#                 "id": conv.id,
#                 "user": conv.user,
#                 "assistant": conv.assistant,
#                 "dataset_id": conv.dataset_id
#             })

#     with open("conversations_with_russian1.json", "w", encoding="utf-8") as f:
#         json.dump(filtered, f, ensure_ascii=False, indent=4)

#     return {"message": f"Сохранено {len(filtered)} conversations с русским языком"}

@app.get("/export-conversations-with-russian/")
def export_conversations_with_russian(
    dataset_id: int = Query(...),
    db: Session = Depends(get_db)
):
    conversations = db.query(Conversation).filter(Conversation.dataset_id == dataset_id).all()

    filtered = []
    for conv in conversations:
        combined_text = f"{conv.user or ''} {conv.assistant or ''}"
        if is_russian(combined_text):
            filtered.append({
                "id": conv.id,
                "user": conv.user,
                "assistant": conv.assistant,
                "dataset_id": conv.dataset_id
            })

    return {
        "total": len(filtered),
        "dataset_id": dataset_id,
        "conversations": filtered
    }

@app.put("/conversations/{conversation_id}", response_model=ConversationOut)
def update_conversation(
    conversation_id: int = Path(..., description="ID of the conversation to update"),
    update_data: ConversationUpdate = ...,
    db: Session = Depends(get_db)
):
    conversation = db.query(Conversation).filter(Conversation.id == conversation_id).first()
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")

    conversation.user = update_data.user
    conversation.assistant = update_data.assistant

    db.commit()
    db.refresh(conversation)
    return conversation



@app.put("/conversations/{conversation_id}", response_model=ConversationOut)
def update_conversation(
    conversation_id: int = Path(..., description="ID of the conversation to update"),
    update_data: ConversationUpdate = ...,  # expects {"user": "...", "assistant": "..."}
    db: Session = Depends(get_db)
):
    conversation = db.query(Conversation).filter(Conversation.id == conversation_id).first()
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")

    conversation.user = update_data.user
    conversation.assistant = update_data.assistant

    db.commit()
    db.refresh(conversation)
    return conversation


@app.delete("/conversations/{conversation_id}")
def delete_conversation(
    conversation_id: int = Path(..., description="ID of the conversation to delete"),
    db: Session = Depends(get_db)
):
    conversation = db.query(Conversation).filter(Conversation.id == conversation_id).first()
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")

    db.delete(conversation)
    db.commit()
    return {"detail": "Conversation deleted successfully"}
