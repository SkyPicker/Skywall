from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from skywall.core.database import Model
from skywall.core.signals import Signal


before_group_create = Signal('before_group_create')
after_group_create = Signal('after_group_create')


class Group(Model):
    __tablename__ = 'group'

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False, unique=True)
    description = Column(String, nullable=False, server_default='')

    clients = relationship('Client', back_populates='group')

    def __repr__(self):
        return '<Group id={0.id} name={0.name}>'.format(self)
