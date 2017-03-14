from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from core.config import config


Model = declarative_base()
engine = None
session = None

def connectDatabase():
    global engine, session
    database = config.get('server.database')
    engine = create_engine(database, echo=True)
    session = sessionmaker(bind=engine)
    Model.metadata.create_all(engine)

def Session():
    return session()
