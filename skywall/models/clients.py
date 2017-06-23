from sqlalchemy import Column, Integer, String, TIMESTAMP, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql.functions import current_timestamp
from skywall.core.database import Model
from skywall.core.signals import Signal


before_client_create = Signal('before_client_create')
after_client_create = Signal('after_client_create')
before_client_update = Signal('before_client_update')
after_client_update = Signal('after_client_update')


class Client(Model):
    __tablename__ = 'client'

    id = Column(Integer, primary_key=True)
    created = Column(TIMESTAMP(timezone=True), nullable=False, server_default=current_timestamp())
    token = Column(String, nullable=False)
    label = Column(String, nullable=False, server_default='')
    group_id = Column(Integer, ForeignKey('group.id'), nullable=True)

    group = relationship('Group', back_populates='clients')
    reports = relationship('Report', back_populates='client')
    connections = relationship('Connection', back_populates='client')

    def __repr__(self):
        return '<Client id={0.id} label={0.label}>'.format(self)
