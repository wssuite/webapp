from flask import Blueprint, request
import asyncio

mod = Blueprint('index', __name__, url_prefix='/index')


@mod.route('/', methods=["GET"])
def index():
    asyncio.run(sleep())
    return request.json


async def sleep():
    await asyncio.create_subprocess_shell("time sleep 1m",
                                          stdout=asyncio.subprocess.PIPE,
                                          stderr=asyncio.subprocess.PIPE)
