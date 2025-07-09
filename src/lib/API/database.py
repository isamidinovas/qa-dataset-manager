# database.py
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# ЗАМЕНИ на свои данные
DB_USER = "postgres"
DB_PASSWORD = "qwerty1234"
DB_HOST = "localhost"
DB_PORT = "5432"
DB_NAME = "dataset-db"

SQLALCHEMY_DATABASE_URL = (
    f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
)

# Подключение к базе данных
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# Создание сессии
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Базовый класс для моделей
Base = declarative_base()
