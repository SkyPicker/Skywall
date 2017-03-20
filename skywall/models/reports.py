from sqlalchemy import Column, Integer, String, TIMESTAMP, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql.functions import current_timestamp
from sqlalchemy.dialects.postgresql import JSONB
from skywall.core.database import Model


class Report(Model):
    __tablename__ = 'report'

    id = Column(Integer, primary_key=True)
    created = Column(TIMESTAMP(timezone=True), nullable=False, server_default=current_timestamp())
    client_id = Column(Integer, ForeignKey('client.id'), nullable=False)

    client = relationship('Client', back_populates='reports')
    values = relationship('ReportValue', back_populates='report')

    def __repr__(self):
        return '<Report id={[id]} client_id={[client_id]}>'.format(self)


class ReportValue(Model):
    __tablename__ = 'report_value'

    id = Column(Integer, primary_key=True)
    created = Column(TIMESTAMP(timezone=True), nullable=False, server_default=current_timestamp())
    report_id = Column(Integer, ForeignKey('report.id'), nullable=False)
    name = Column(String, nullable=False)
    value = Column(JSONB, nullable=False, server_default='{}')

    report = relationship('Report', back_populates='values')

    def __repr__(self):
        return '<ReportValue id={[id]} report_id={[report_id]} name={[name]}>'.format(self)
