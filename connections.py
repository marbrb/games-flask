import MySQLdb

def create_connection():
    db = MySQLdb.connect(db="wormi", passwd="miguel")
    c = db.cursor()
    return db, c

def serialize(fields, values):
    """serializar estructuras a json"""
    r = []
    for y in values:
        r.append([str(x) for x in y])

    json = []
    for x in r:
        d = {}
        for i in range(len(fields)):
            d[fields[i]] = x[i]
        json.append(d)
        del d

    return json

def get_scores():
    db, c = create_connection()
    c.execute("SELECT * FROM scores")
    data = c.fetchall()
    fields = ["user","score"]
    r = []
    if data:
        json = serialize(fields, data)
        return json
    else:
        return r
