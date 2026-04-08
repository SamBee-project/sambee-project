"""add weight nullable to sensor_readings

Revision ID: a1b2c3d4e5f6
Revises: 8b235af3925c
Create Date: 2026-04-08 21:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = 'a1b2c3d4e5f6'
down_revision: Union[str, None] = '8b235af3925c'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add weight column if missing, or alter to nullable if already exists
    conn = op.get_bind()
    columns = [row[0] for row in conn.execute(
        sa.text("SELECT column_name FROM information_schema.columns WHERE table_name='sensor_readings'")
    )]

    if 'weight' not in columns:
        op.add_column('sensor_readings', sa.Column('weight', sa.Float(), nullable=True))
    else:
        op.alter_column('sensor_readings', 'weight', existing_type=sa.Float(), nullable=True)


def downgrade() -> None:
    op.alter_column('sensor_readings', 'weight', existing_type=sa.Float(), nullable=False)
