import shutil
import tempfile
from fastapi import FastAPI, Depends, File, HTTPException, Query, UploadFile
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
from fastapi.responses import FileResponse
import re, langid, pandas as pd
import os
import io
from fastapi.responses import StreamingResponse
from datetime import datetime
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

# @app.get("/conversations/", response_model=List[ConversationOut])
# def get_conversations(
#     dataset_id: int = Query(..., description="ID набора данных для фильтрации"),
#     search: Optional[str] = Query(None, description="Текст для поиска в user и assistant"),
#     db: Session = Depends(get_db)
# ):
#     query = db.query(Conversation).filter(Conversation.dataset_id == dataset_id)
#     if search:
#         like_pattern = f"%{search}%"
#         query = query.filter(
#             (Conversation.user.ilike(like_pattern)) |
#             (Conversation.assistant.ilike(like_pattern))
#         )
#     return query.all()


# APPROVED
# --- Проверка на русский (из вашего кода) ---
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

# --- Основной API ---
@app.get("/conversations/", response_model=List[ConversationOut])
def get_conversations(
    dataset_id: int = Query(..., description="ID набора данных для фильтрации"),
    search: Optional[str] = Query(None, description="Текст для поиска в user и assistant"),
    exclude_russian: bool = Query(False, description="Исключить русскоязычные диалоги"),
    db: Session = Depends(get_db)
):
    query = db.query(Conversation).filter(Conversation.dataset_id == dataset_id)

    if search:
        like_pattern = f"%{search}%"
        query = query.filter(
            (Conversation.user.ilike(like_pattern)) |
            (Conversation.assistant.ilike(like_pattern))
        )

    conversations = query.all()

    # --- Фильтрация на Python уровне ---
    if exclude_russian:
        conversations = [
            conv for conv in conversations
            if not is_russian(f"{conv.user or ''} {conv.assistant or ''}")
        ]

    return conversations


# # --- API с Excel экспортом ---
# # --- Проверка на русский ---
# def has_cyrillic(text: str) -> bool:
#     return bool(re.search(r'[а-яё]', text.lower()))

# @lru_cache(maxsize=5000)
# def is_russian_cached(text: str) -> bool:
#     try:
#         return langid.classify(text.strip())[0] == 'ru'
#     except:
#         return False

# def is_russian(text: str) -> bool:
#     if not has_cyrillic(text):
#         return False
#     return is_russian_cached(text)


# @app.get("/conversations/")
# def get_conversations(
#     dataset_id: int = Query(..., description="ID набора данных для фильтрации"),
#     search: Optional[str] = Query(None, description="Текст для поиска в user и assistant"),
#     exclude_russian: bool = Query(False, description="Исключить русскоязычные диалоги"),
#     export_excel: bool = Query(False, description="Экспортировать результат в Excel"),
#     db: Session = Depends(get_db)
# ):
#     query = db.query(Conversation).filter(Conversation.dataset_id == dataset_id)

#     if search:
#         like_pattern = f"%{search}%"
#         query = query.filter(
#             (Conversation.user.ilike(like_pattern)) |
#             (Conversation.assistant.ilike(like_pattern))
#         )

#     conversations = query.all()

#     # Фильтрация русскоязычных
#     if exclude_russian:
#         conversations = [
#             conv for conv in conversations
#             if not is_russian(f"{conv.user or ''} {conv.assistant or ''}")
#         ]

#     # Если НЕ нужно экспортировать Excel → обычный JSON ответ
#     if not export_excel:
#         return [
#             {
#                 "id": conv.id,
#                 "user": conv.user,
#                 "assistant": conv.assistant,
#                 "dataset_id": conv.dataset_id
#             }
#             for conv in conversations
#         ]

#     # --- Экспорт в Excel ---
#     data = [
#         {
#             "ID": conv.id,
#             "User": conv.user,
#             "Assistant": conv.assistant,
#             "Dataset ID": conv.dataset_id
#         }
#         for conv in conversations
#     ]

#     df = pd.DataFrame(data)

#     # Папка для экспорта
#     export_dir = "exports"
#     os.makedirs(export_dir, exist_ok=True)

#     filename = f"conversations_{dataset_id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.xlsx"
#     filepath = os.path.join(export_dir, filename)

#     df.to_excel(filepath, index=False)

#     return FileResponse(
#         filepath,
#         media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
#         filename=filename
#     )

# def has_cyrillic(text: str) -> bool:
#     """Quick check for Cyrillic characters"""
#     return bool(re.search(r'[а-яё]', text.lower()))

# @lru_cache(maxsize=5000)
# def is_russian_cached(text: str) -> bool:
#     """Cached language detection"""
#     try:
#         return langid.classify(text.strip())[0] == 'ru'
#     except:
#         return False

# def is_russian(text: str) -> bool:
#     """Optimized Russian detection"""
#     if not has_cyrillic(text):
#         return False
    
#     return is_russian_cached(text)



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
def get_rejected_records(source: str, other_source: str, search: str = None):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    query = f"""
        SELECT word, source, definition, examples
        FROM {TABLE_NAME}
        WHERE source = ?
        AND word IN (
            SELECT word FROM {TABLE_NAME} WHERE source = ?
        )
    """
    params = [source, other_source]

    if search:
        query += " AND word LIKE ?"
        params.append(f"%{search}%")

    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()

    return [
        {
            "word": row[0],
            "source": row[1],
            "definition": row[2],
            "examples": row[3]
        } for row in rows
    ]

# Для скачивания неуникальных слов
@app.get("/rejected-words-excel/")
def rejected_words_excel(
    search: str = None,
    source: str = "file2",
    other_source: str = "file1",
    export_excel: bool = True
):
    rejected = get_rejected_records(source, other_source, search)

    if export_excel:
        df = pd.DataFrame(rejected)
        file_name = f"Rejected_{source}_vs_{other_source}.xlsx"
        df.to_excel(file_name, index=False)
        return FileResponse(
            file_name,
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            filename=file_name
        )

    return {"total_rejected": len(rejected), "rejected": rejected}



def get_unique_records(source: str, other_source: str, search: Optional[str] = None, limit: Optional[int] = 50, offset: int = 0):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

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
    if limit is None:
        paginated = unique_rows[offset:]
    else:
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








# CORRECT Для скачивания уникальных слов
# @app.get("/unique-words/")
# def unique_words(
#     search: Optional[str] = Query(None),
#     limit: Optional[int] = Query(50, ge=1, le=200),
#     offset: Optional[int] = Query(0, ge=0),
#     export_excel: Optional[bool] = Query(False)
# ):
#     # Если экспорт в Excel, игнорируем лимит и оффсет, возвращаем все данные
#     if export_excel:
#         limit = None
#         offset = 0

#     # Для передачи None в функцию get_unique_records, нужно поправить функцию, чтобы она поддерживала limit=None
#     oruscha_only, oruscha_total = get_unique_records("file2", "file1", search, limit, offset)
#     kyrgyzcha_only, kyrgyzcha_total = get_unique_records("file1", "file2", search, limit, offset)

#     if not export_excel:
#         return {
#             "oruscha_kyrgyzcha_only": oruscha_only,
#             "oruscha_total": oruscha_total,
#             "kyrgyzcha_oruscha_only": kyrgyzcha_only,
#             "kyrgyzcha_total": kyrgyzcha_total
#         }

#     import io
#     import pandas as pd
#     from fastapi.responses import StreamingResponse

#     df_rus_kg = pd.DataFrame(oruscha_only)
#     df_kg_rus = pd.DataFrame(kyrgyzcha_only)

#     output = io.BytesIO()
#     with pd.ExcelWriter(output, engine='openpyxl') as writer:
#         df_rus_kg.to_excel(writer, index=False, sheet_name='Русско-Кырг')
#         df_kg_rus.to_excel(writer, index=False, sheet_name='Кырг-Русс')

#     output.seek(0)

#     headers = {
#         "Content-Disposition": "attachment; filename=unique_words.xlsx"
#     }

#     return StreamingResponse(
#         output,
#         media_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
#         headers=headers
#     )




# @app.get("/unique-words-rus-kg/")
# def unique_words_rus_kg(
#     search: Optional[str] = Query(None),
# ):
#     # Берём ВСЕ данные
#     oruscha_only, _ = get_unique_records("file2", "file1", search, limit=None, offset=0)

#     import io
#     import pandas as pd
#     from fastapi.responses import StreamingResponse

#     df_rus_kg = pd.DataFrame(oruscha_only)

#     output = io.BytesIO()
#     with pd.ExcelWriter(output, engine='openpyxl') as writer:
#         df_rus_kg.to_excel(writer, index=False, sheet_name='Русско-Кырг')

#     output.seek(0)

#     headers = {
#         "Content-Disposition": "attachment; filename=rus_kyrg_unique.xlsx"
#     }

#     return StreamingResponse(
#         output,
#         media_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
#         headers=headers
#     )



# @app.get("/unique-words-kg-rus/")
# def unique_words_kg_rus(
#     search: Optional[str] = Query(None),
# ):
#     # Берём ВСЕ данные
#     kyrgyzcha_only, _ = get_unique_records("file1", "file2", search, limit=None, offset=0)

#     import io
#     import pandas as pd
#     from fastapi.responses import StreamingResponse

#     df_kg_rus = pd.DataFrame(kyrgyzcha_only)

#     output = io.BytesIO()
#     with pd.ExcelWriter(output, engine='openpyxl') as writer:
#         df_kg_rus.to_excel(writer, index=False, sheet_name='Кырг-Русс')

#     output.seek(0)

#     headers = {
#         "Content-Disposition": "attachment; filename=kyrg_rus_unique.xlsx"
#     }

#     return StreamingResponse(
#         output,
#         media_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
#         headers=headers
#     )





import re
import os
import shutil
import tempfile
import zipfile
from typing import Set, List
import pandas as pd
from fastapi import FastAPI, UploadFile, File, HTTPException, BackgroundTasks, Depends
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session


def normalize_word(word: str) -> str:
    return word.strip().lower()

def extract_words(text: str) -> List[str]:
    return re.findall(r'\w+', text.lower())


def export_dialogues_by_words(db: Session, excel_path: str, output_dir: str):
    df_words = pd.read_excel(excel_path)
    if "word" not in df_words.columns:
        raise ValueError("Excel файл должен содержать колонку 'word'")

    # ✅ Базовые игнорируемые слова
    ignore_words = {"берет", "сага"}

    # ✅ Добавляем римские цифры (в нижнем регистре)
    roman_numerals = {
        "i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x",
        "xi", "xii", "xiii", "xiv", "xv", "xvi", "xvii", "xviii", "xix", "xx"
    }
    ignore_words.update(roman_numerals)

    # ✅ Формируем множество слов из Excel, исключая игнорируемые
    words_list = df_words["word"].dropna().astype(str).tolist()
    words_set = {
        normalize_word(w)
        for w in words_list
        if (
            w.strip()
            and normalize_word(w) not in ignore_words
            and len(normalize_word(w)) > 1
        )
    }

    conversations = db.query(Conversation).all()

    with_words, without_words = [], []
    with_words_found = []

    for conv in conversations:
        text = f"{conv.user or ''} {conv.assistant or ''}"
        dialogue_words = extract_words(text)

        # ✅ Игнорируем "берет", "сага", римские цифры и однобуквенные слова
        found_words = {
            normalize_word(w)
            for w in dialogue_words
            if (
                normalize_word(w) in words_set
                and normalize_word(w) not in ignore_words
                and len(normalize_word(w)) > 1
            )
        }

        # ✅ Условие: только если найдено более 2 слов
        if len(found_words) > 2:
            with_words.append(conv)
            with_words_found.append(", ".join(sorted(found_words)))
        else:
            without_words.append(conv)

    def convs_to_dict(convs, found_words_list=None):
        res = []
        for i, c in enumerate(convs):
            d = {
                "id": c.id,
                "user": c.user,
                "assistant": c.assistant
            }
            if found_words_list:
                d["found_words"] = found_words_list[i]
            res.append(d)
        return res

    file_with = os.path.join(output_dir, "with_words.xlsx")
    file_without = os.path.join(output_dir, "without_words.xlsx")

    pd.DataFrame(convs_to_dict(with_words, with_words_found)).to_excel(file_with, index=False)
    pd.DataFrame(convs_to_dict(without_words)).to_excel(file_without, index=False)

    return file_with, file_without


@app.post("/download-dialogues-zip/")
async def download_dialogues_zip(
    excel_file: UploadFile = File(...),
    background_tasks: BackgroundTasks = None,
    db: Session = Depends(get_db),
):
    if not excel_file.filename.endswith(('.xlsx', '.xls')):
        raise HTTPException(status_code=400, detail="Файл должен быть в формате Excel")

    tmpdir = tempfile.mkdtemp()
    try:
        excel_path = os.path.join(tmpdir, excel_file.filename)
        with open(excel_path, "wb") as f:
            shutil.copyfileobj(excel_file.file, f)

        file_with, file_without = export_dialogues_by_words(db, excel_path, tmpdir)

        zip_path = os.path.join(tmpdir, "dialogues.zip")
        with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zipf:
            zipf.write(file_with, arcname="with_words.xlsx")
            zipf.write(file_without, arcname="without_words.xlsx")

        if background_tasks:
            background_tasks.add_task(shutil.rmtree, tmpdir)

        return FileResponse(path=zip_path, media_type="application/zip", filename="dialogues.zip")

    except Exception as e:
        shutil.rmtree(tmpdir)
        raise HTTPException(status_code=500, detail=f"Ошибка: {str(e)}")

