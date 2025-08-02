import os
import datetime
import json
from dotenv import load_dotenv

from flask import Flask, render_template
from flask import request
from celery import Celery

load_dotenv()
app = Flask(__name__)


@app.route('/tx/<txHash>', methods = ['GET', 'POST', 'DELETE'])
def handle_transaction(txHash):
    if request.method == 'GET':
        return txHash
    elif request.method == 'POST':
        return txHash
    elif request.method == 'DELETE':
        return txHash
