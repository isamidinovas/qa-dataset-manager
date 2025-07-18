# вот это правильно работает
# import fasttext

# model = fasttext.load_model("C:/Users/user/Downloads/lid.176.bin")
# print(model.predict("Суроо: 79 жаштагы эркек киши орточо күч келтирүүдө дем кыстыгуу жана бир аз какырыктуу жөтөл менен кайрылды. Анын анамнезинде 25 жылдык тамеки тартуу тарыхы бар. Анын виталдык көрсөткүчтөрү: жүрөктүн кагышы 89/мүн, дем алуу жыштыгы 27/мүн жана кан басымы 120/90 мм сым. мамычасы. Физикалык текшерүү перкуссияда резонанстын күчөшүн, дем алуу үндөрүнүн азайышын жана өпкөнүн түбүндөгү ырылдарды көрсөтөт. Көкүрөк рентгенограммасы өпкөнүн гипервентиляциясынын белгилерин көрсөтөт. Спирометрия биринчи секунддагы мажбурлап чыгарылган көлөмдү (FEV1) 48%, мажбурлап жашоо сыйымдуулугун (FVC) 85% жана FEV1/FVC катышын 56% көрсөтөт. Бул маалыматтын негизинде, анын ичинде пациенттин анамнези, физикалык белгилери жана спирометриянын жыйынтыктары, эң ыктымалдуу диагноз кайсы? Варианттар: (A Астма (B Лимфангиолейомиоматоз (C Өпкөнүн өнөкөт обструктивдүү оорусу (ӨООО) (D Жүрөк жетишсиздиги Түшүндүрмө: Келгиле, муну кадам сайын, зарылчылыкка жараша авторитеттүү медициналык булактар ​​менен кылдаттык менен текшерип чыгалы. Пациенттин тамеки тартуу тарыхы, физикалык текшерүүнүн жыйынтыктары, анда дем алуу үндөрүнүн азайганын жана өпкөнүн түбүндөгү ырылдарды көрсөткөнү, ошондой эле спирометриянын жыйынтыктары, анда FEV1/FVC төмөн катышы көрсөтүлгөнү өпкөнүн өнөкөт обструктивдүү оорусун (ӨООО) күчтүү түрдө көрсөтүп турат. Астма адатта FEV1/FVC жогорураак катышын көрсөтөт. Лимфангиолейомиоматоз, адатта, FEV1/FVC нормалдуу катышына ээ. Жүрөк жетишсиздиги, FEV1/FVC төмөн катышына ээ болсо да, пациенттин виталдык көрсөткүчтөрү бул диагнозго дал келбегендиктен, эске алынбайт. Жооп: (C Өпкөнүн өнөкөт обструктивдүү оорусу (ӨООО) Нускама: Жогоруда студенттин толук медициналык учуру жана аналитикалык жообу келтирилген. Мага жоопту чыгарып, берилген төрт варианттын бирин көрсөтүү керек. Сиздин милдетиңиз - жөн гана жоопту так чыгарып (анын тууралыгына карабастан) жана аны тамга түрүндө көрсөтүү. Сиздин жообуңуздун форматы төмөнкүдөй болушу керек: Жооп: X X - A, B, C же D баш тамгаларынын бири болушу керек. Болгону тамга гана керек."))


# import fasttext
# import json
# from sqlalchemy import Text, create_engine, select
# from sqlalchemy.orm import sessionmaker, declarative_base
# from sqlalchemy import Column, Integer, String


# # # Настройки подключения к БД
# DATABASE_URL = "postgresql://postgres:qwerty1234@localhost:5432/dataset-db"

# # SQLAlchemy setup
# engine = create_engine(DATABASE_URL)
# Session = sessionmaker(bind=engine)
# session = Session()
# Base = declarative_base()

# class Conversation(Base):
#     __tablename__ = "conversations"

#     id = Column(Integer, primary_key=True, index=True)
#     dataset_id = Column(Integer, index=True)
#     user = Column(Text)
#     assistant = Column(Text)

# # Загрузка FastText модели
# print("Загрузка модели...")
# model = fasttext.load_model("C:/Users/user/Downloads/lid.176.bin")


# def is_russian(text):
#     clean_text = text.replace('\n', ' ').strip()
#     label, _ = model.predict(clean_text)
#     return label[0] == '__label__ru'

# # Получение всех данных из таблицы
# conversations = session.execute(select(Conversation)).scalars().all()
# russian_conversations = []
# for conv in conversations:
#         if is_russian(conv.user) or is_russian(conv.assistant):
#             russian_conversations.append({
#                 "user": conv.user,
#                 "assistant": conv.assistant
#             })

# print(f"Найдено {len(russian_conversations)} записей с русским языком.")

# with open("russian_conversations.json", "w", encoding="utf-8") as f:
#         json.dump(russian_conversations, f, ensure_ascii=False, indent=4)

# print("Данные сохранены в russian_conversations.json")



# import json


# engine = create_engine(DATABASE_URL)
# Session = sessionmaker(bind=engine)
# session = Session()

# Base = declarative_base()

# class Conversation(Base):
#     __tablename__ = "conversations"  # имя таблицы в базе
#     id = Column(Integer, primary_key=True)
#     user = Column(Text)
#     assistant = Column(Text)

# # --- Загрузка модели fastText ---

# model = fasttext.load_model("C:/Users/user/Downloads/lid.176.bin")

# def is_russian(text: str) -> bool:
#     if not text:
#         return False
#     clean_text = text.replace('\n', ' ').strip()
#     labels, _ = model.predict(clean_text)
#     return labels[0] == '__label__ru'

# # --- Основной код ---



# def get_russian_conversations():
#     russian_items = []
#     conversations = session.query(Conversation).all()
#     for conv in conversations:
#         # Проверяем поля user и assistant
#         if is_russian(conv.user) or is_russian(conv.assistant):
#             # Формируем словарь для записи в JSON
#             russian_items.append({
#                 "user": conv.user,
#                 "assistant": conv.assistant
#             })
#     return russian_items

# def save_to_json(data, filename="russian_conversations2.json"):
#     with open(filename, "w", encoding="utf-8") as f:
#         json.dump(data, f, ensure_ascii=False, indent=2)

# if __name__ == "__main__":
#     data = get_russian_conversations()
#     save_to_json(data)
#     print(f"Сохранено {len(data)} записей с русским языком в файл russian_conversations2.json")

import sqlite3

DB_PATH = "data/dictionary3.sqlite"

conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
print("Tables:", cursor.fetchall())

conn.close()
