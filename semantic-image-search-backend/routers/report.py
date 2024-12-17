from db.db import get_db_session
from db.models import Reports, ReportCreate, ReportStatus
from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from sqlmodel import Session

report = APIRouter(prefix="/report", tags=["report"])


@report.post("", response_model=ReportCreate)
async def post_report(report: ReportCreate, session: Session = Depends(get_db_session)):
    try:
        data = Reports(
            post_id=report.post_id,
            report_category=report.report_category,
            report_reason=report.report_reason,
            status=ReportStatus.pending,
            resolved_at=None
        )

        session.add(data)
        session.commit()

        return JSONResponse(status_code=200, content={"message": "report success"})
    except Exception as e:
        session.rollback()
        return JSONResponse(status_code=500,
                            content={"message": "An error occurred while creating the report", "detail": str(e)})
