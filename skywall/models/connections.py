from sqlalchemy import Column, Integer, TIMESTAMP, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql.functions import current_timestamp
from skywall.core.database import Model
from skywall.core.signals import Signal


before_connection_create = Signal('before_connection_create')
after_connection_create = Signal('after_connection_create')
before_connection_update = Signal('before_connection_update')
after_connection_update = Signal('after_connection_update')


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
