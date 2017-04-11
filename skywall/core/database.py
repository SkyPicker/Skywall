# pylint: disable=invalid-name, global-statement
from contextlib import contextmanager
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from skywall.core.config import config


Model = declarative_base()
engine = None
session = None

def connect_database():
    global engine, session
    database = config.get('server.database')
    engine = create_engine(database, echo=True)
    session = sessionmaker(bind=engine)
    Model.metadata.create_all(engine)

@contextmanager
def Session():
    s = session()
    try:
        yield s
        s.commit()
    except:
        s.rollback()
        raise
    finally:
        s.close()
