from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from skywall.core.database import Model
from skywall.core.signals import Signal
from skywall.models.clients import Client


before_group_create = Signal('before_group_create')
after_group_create = Signal('after_group_create')
before_group_update = Signal('before_group_update')
after_group_update = Signal('after_group_update')
before_group_delete = Signal('before_group_delete')
after_group_delete = Signal('after_group_delete')


class Group(Model):
    __tablename__ = 'group'

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False, unique=True)
    description = Column(String, nullable=False, server_default='')

    clients = relationship('Client', back_populates='group')

    def __repr__(self):
        return '<Group id={0.id} name={0.name}>'.format(self)


def get_group_clients(session, group):
    """
    We can't use directly `group.clients` for the DEFAULT group because it is represented by `None`. Unless we are
    sure the group is not DEFAULT, we must use `get_group_clients(session, group)` instead.
    """
    if group is None:
        # pylint: disable=singleton-comparison
        return session.query(Client).filter(Client.group_id == None).all()
    else:
        return group.clients
