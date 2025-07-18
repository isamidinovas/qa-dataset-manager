from fastapi import FastAPI, Depends, HTTPException, Query
import langid
from sqlalchemy.orm import Session
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Path
from database import SessionLocal
from models import Conversation
from schemas import ConversationOut, ConversationUpdate  # pydantic-схема для ответа
import re
from functools import lru_cache
from typing import Optional
from fastapi import Query
import sqlite3
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


# FASTTEXT library
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


# # APPROVED langid library
# import langid

# def is_russian(text: str) -> bool:
#     try:
#         return langid.classify(text)[0] == 'ru'
#     except:
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

#     with open("conversations_with_russian1.json", "w", encoding="utf-8") as f:
#         json.dump(filtered, f, ensure_ascii=False, indent=4)

#     return {"message": f"Сохранено {len(filtered)} conversations с русским языком"}

# APPROVEDDD
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

#     return {
#         "total": len(filtered),
#         "dataset_id": dataset_id,
#         "conversations": filtered
#     }



def has_cyrillic(text: str) -> bool:
    """Quick check for Cyrillic characters"""
    return bool(re.search(r'[а-яё]', text.lower()))

@lru_cache(maxsize=5000)
def is_russian_cached(text: str) -> bool:
    """Cached language detection"""
    try:
        return langid.classify(text.strip())[0] == 'ru'
    except:
        return False

def is_russian(text: str) -> bool:
    """Optimized Russian detection"""
    if not has_cyrillic(text):
        return False
    
    return is_russian_cached(text)



@app.get("/export-conversations-with-russian/")
def export_conversations_with_russian(
    dataset_id: int = Query(...),
    search: Optional[str] = Query(None, description="Текст для поиска в user и assistant"),
    db: Session = Depends(get_db)
):
    conversations = db.query(Conversation).filter(Conversation.dataset_id == dataset_id).all()

    filtered = []
    for conv in conversations:
        combined_text = f"{conv.user or ''} {conv.assistant or ''}"

        if is_russian(combined_text):  
            if search:
                if search.lower() in (conv.user or "").lower() or search.lower() in (conv.assistant or "").lower():
                    filtered.append({
                        "id": conv.id,
                        "user": conv.user,
                        "assistant": conv.assistant,
                        "dataset_id": conv.dataset_id
                    })
            else:
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


DB_PATH = r'C:\Users\user\Downloads\dictionary3.sqlite'
TABLE_NAME = "dictionary_table"  # your actual table name

# def get_unique_records(source: str, other_source: str):
#     conn = sqlite3.connect(DB_PATH)
#     cursor = conn.cursor()

#     # Получаем все слова для обоих источников
#     cursor.execute(f"SELECT word, source, definition, examples FROM {TABLE_NAME} WHERE source = ?", (source,))
#     source_rows = cursor.fetchall()

#     cursor.execute(f"SELECT word FROM {TABLE_NAME} WHERE source = ?", (other_source,))
#     other_words = {row[0].strip().lower() for row in cursor.fetchall() if row[0]}  # множество для быстрого поиска

#     conn.close()

#     # Фильтруем уникальные слова
#     return [
#         {
#             "word": row[0],
#             "source": row[1],
#             "definition": row[2],
#             "examples": row[3]
#         }
#         for row in source_rows
#         if row[0] and row[0].strip().lower() not in other_words
#     ]


# CORRECT
def get_unique_records(source: str, other_source: str, search: Optional[str] = None, limit: int = 50, offset: int = 0):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Получаем все слова из каждого источника с учётом поиска
    if search:
        cursor.execute(
            f"SELECT word, source, definition, examples FROM {TABLE_NAME} WHERE source = ? AND word = ?",
            (source, search)
        )
    else:
        cursor.execute(
            f"SELECT word, source, definition, examples FROM {TABLE_NAME} WHERE source = ?",
            (source,)
        )
    source_rows = cursor.fetchall()

    cursor.execute(f"SELECT word FROM {TABLE_NAME} WHERE source = ?", (other_source,))
    other_words = {row[0].strip().lower() for row in cursor.fetchall() if row[0]}

    conn.close()

    # Фильтруем уникальные слова
    unique_rows = [
        {
            "word": row[0],
            "source": row[1],
            "definition": row[2],
            "examples": row[3]
        }
        for row in source_rows
        if row[0] and row[0].strip().lower() not in other_words
    ]

    total = len(unique_rows)
    paginated = unique_rows[offset:offset+limit]
    return paginated, total




@app.get("/unique-words/")
def unique_words(
    search: Optional[str] = Query(None),
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0)
):
    oruscha_only, oruscha_total = get_unique_records("file2", "file1", search, limit, offset)
    kyrgyzcha_only, kyrgyzcha_total = get_unique_records("file1", "file2", search, limit, offset)
    return {
        "oruscha_kyrgyzcha_only": oruscha_only,
        "oruscha_total": oruscha_total,
        "kyrgyzcha_oruscha_only": kyrgyzcha_only,
        "kyrgyzcha_total": kyrgyzcha_total
    }







# def get_unique_records(source: str, other_source: str, search: str = ""):
#     conn = sqlite3.connect(DB_PATH)
#     cursor = conn.cursor()

#     # Формируем условие для поиска
#     search_param = f"%{search.lower()}%"

#     query = f"""
#     SELECT word, source, definition, examples
#     FROM {TABLE_NAME}
#     WHERE source = ?
#     AND lower(trim(word)) NOT IN (
#         SELECT lower(trim(word)) FROM {TABLE_NAME} WHERE source = ?
#     )
#     """

#     # Если есть поиск, добавляем условия LIKE для word, definition, examples
#     if search:
#         query += """
#         AND (
#             lower(word) LIKE ?
#             OR lower(definition) LIKE ?
#             OR lower(examples) LIKE ?
#         )
#         """

#         cursor.execute(query, (source, other_source, search_param, search_param, search_param))
#     else:
#         cursor.execute(query, (source, other_source))

#     results = [
#         {
#             "word": row[0],
#             "source": row[1],
#             "definition": row[2],
#             "examples": row[3],
#         }
#         for row in cursor.fetchall()
#     ]

#     conn.close()
#     return results

# @app.get("/unique-words/")
# def unique_words(search: str = Query("", description="Поисковый запрос")):
#     # Вызов get_unique_records с передачей search
#     oruscha_only = get_unique_records("file2", "file1", search)
#     kyrgyzcha_only = get_unique_records("file1", "file2", search)
#     return {
#         "oruscha_kyrgyzcha_only": oruscha_only,
#         "kyrgyzcha_oruscha_only": kyrgyzcha_only
#     }