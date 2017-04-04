from sqlalchemy import Column, Integer, String, TIMESTAMP
from sqlalchemy.orm import relationship
from sqlalchemy.sql.functions import current_timestamp
from skywall.core.database import Model


class Client(Model):
    __tablename__ = 'client'

    id = Column(Integer, primary_key=True)
    created = Column(TIMESTAMP(timezone=True), nullable=False, server_default=current_timestamp())
    token = Column(String, nullable=False)
    label = Column(String, nullable=False, server_default='')

    reports = relationship('Report', back_populates='client')

    def __repr__(self):
        return '<Client id={0.id} label={0.label}>'.format(self)
