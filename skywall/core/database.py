from contextlib import contextmanager
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from skywall.core.config import config


Model = declarative_base()
_session = None

def connect_database():
    # pylint: disable=global-statement
    global _session
    database = config.get('server.database')
    engine = create_engine(database, echo=True)
    _session = sessionmaker(bind=engine)
    Model.metadata.create_all(engine)

@contextmanager
def create_session():
    session = _session()
    try:
        yield session
        session.commit()
    except:
        session.rollback()
        raise
    finally:
        session.close()
