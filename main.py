from rmp_client import RMPClient
client = RMPClient()
import requests
import praw
from fastapi import FastAPI
from database import get_prof
app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get('/reviews/{first_name}&{last_name}')
async def read_prof_id(first_name: str, last_name: str):
    result = get_prof(first_name.lower(), last_name.lower())
    return result