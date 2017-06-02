from flask import Flask, render_template, request
import json
from connections import get_scores

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/scores', methods=['GET', 'POST'])
def scores():
    if request.method == 'POST':
        data = request.get_json()
        return data["user"]
        #TODO: SAVE O DATABASE AND RETURN A JSON
    else:
        return json.dumps(get_scores())
