from flask import Flask, render_template, request, redirect
import json
from connections import get_scores, save_score

app = Flask(__name__)


@app.route('/')
def index():
    return redirect('/wormi')

@app.route('/wormi')
def wormi():
    return render_template('wormi.html')

@app.route('/arcade', methods=['GET', 'POST'])
def scores():
    if request.method == 'POST':
        data = request.get_json()
        success = save_score(data["user"], data["score"])
        return json.dumps(success)
    else:
        return json.dumps(get_scores())
