from sqlalchemy import Column, Integer, TIMESTAMP, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql.functions import current_timestamp
from skywall.core.database import Model


class Connection(Model):
    __tablename__ = 'connection'

    id = Column(Integer, primary_key=True)
    created = Column(TIMESTAMP(timezone=True), nullable=False, server_default=current_timestamp())
    client_id = Column(Integer, ForeignKey('client.id'), nullable=False)
    last_activity = Column(TIMESTAMP(timezone=True), nullable=False, server_default=current_timestamp())
    closed = Column(TIMESTAMP(timezone=True), nullable=True)

    client = relationship('Client', back_populates='connections')

    def __repr__(self):
        return '<Report id={0.id} client_id={0.client_id}>'.format(self)
