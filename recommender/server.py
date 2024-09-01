from flask import Flask

app = Flask(__name__)

# flask testing
@app.route("/member")
def members():
    return {"members": ["Member1","Member2","Member3"]}

if __name__ == "__main__":
    app.run(debug=True)