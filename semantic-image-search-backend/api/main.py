from fastapi import FastAPI
from sqlmodel import Session, select

from db.db import create_db_and_tables, engine
from db.models import Test, TestPublic, TestCreate
from routers.admin import admin
from routers.search import search
from routers.upload import upload

app = FastAPI()
app.include_router(search)
app.include_router(upload)
app.include_router(admin)


@app.on_event("startup")
def on_startup():
    print("The application is starting up.")
    create_db_and_tables()


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/hello/{name}")
async def say_hello(name: str):
    return {"message": f"Hello {name}"}


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.post("/test", response_model=TestPublic)
def create_test(test: TestCreate):
    with Session(engine) as session:
        db_test = Test.model_validate(test)
        session.add(db_test)
        session.commit()
        session.refresh(db_test)
        return db_test


@app.get("/test")
def read_test():
    with Session(engine) as session:
        tests = session.exec(select(Test)).all()
        return tests
