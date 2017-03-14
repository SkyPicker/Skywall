from sqlalchemy import Column, Integer, String
from core.database import Model


class Client(Model):
    __tablename__ = 'clients'

    id = Column(Integer, primary_key=True)
    token = Column(String)
    label = Column(String)

    def __repr__(self):
        return '<Client label={}>'.format(self.label)
