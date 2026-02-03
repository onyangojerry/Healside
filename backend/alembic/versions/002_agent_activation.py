"""Agent activation additions

Revision ID: 002
Revises: 001
Create Date: 2026-02-03 00:00:00.000000
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "002"
down_revision: Union[str, None] = "001"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("case_artifacts", sa.Column("citations_json", sa.JSON(), nullable=True))
    op.add_column("case_artifacts", sa.Column("qa_metadata_json", sa.JSON(), nullable=True))
    op.add_column("case_artifacts", sa.Column("updated_at", sa.DateTime(), nullable=True))

    op.add_column("tasks", sa.Column("task_type", sa.String(), nullable=True))
    op.add_column("tasks", sa.Column("started_at", sa.DateTime(), nullable=True))
    op.add_column("tasks", sa.Column("finished_at", sa.DateTime(), nullable=True))
    op.add_column("tasks", sa.Column("input_hash", sa.String(), nullable=True))
    op.add_column("tasks", sa.Column("correlation_id", sa.String(), nullable=True))
    op.add_column("tasks", sa.Column("error_code", sa.String(), nullable=True))
    op.add_column("tasks", sa.Column("error_message", sa.Text(), nullable=True))

    op.create_index("ix_tasks_case_type", "tasks", ["case_id", "task_type"])
    op.create_index("ix_artifacts_case_type", "case_artifacts", ["case_id", "type"])


def downgrade() -> None:
    op.drop_index("ix_artifacts_case_type", table_name="case_artifacts")
    op.drop_index("ix_tasks_case_type", table_name="tasks")

    op.drop_column("tasks", "error_message")
    op.drop_column("tasks", "error_code")
    op.drop_column("tasks", "correlation_id")
    op.drop_column("tasks", "input_hash")
    op.drop_column("tasks", "finished_at")
    op.drop_column("tasks", "started_at")
    op.drop_column("tasks", "task_type")

    op.drop_column("case_artifacts", "updated_at")
    op.drop_column("case_artifacts", "qa_metadata_json")
    op.drop_column("case_artifacts", "citations_json")
