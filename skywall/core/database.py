from contextlib import contextmanager
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from skywall.core.config import config
from skywall.core.signals import Signal


Model = declarative_base()
_session = None

before_database_connect = Signal('before_database_connect')
after_database_connect = Signal('after_database_connect')


def connect_database():
    # pylint: disable=global-statement
    global _session
    before_database_connect.emit()
    database = config.get('server.database')
    engine = create_engine(database, echo=True)
    _session = sessionmaker(bind=engine)
    Model.metadata.create_all(engine)
    after_database_connect.emit()

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
