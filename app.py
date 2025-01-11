from flask import Flask, render_template, request, jsonify
import mysql.connector

app = Flask(__name__)


def connect_to_db():
    return mysql.connector.connect(
        host="localhost",
        user="root",  
        password="Krsushna01&",  
        database="MovieDatabase"
    )

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/movies", methods=["GET"])
def get_all_movies():
    db = connect_to_db()
    cursor = db.cursor()
    query = """
    SELECT MovieID, Title, Year, Certification, IMDbRating, Revenue, Runtime, Language
    FROM Movies;
    """
    cursor.execute(query)
    result = cursor.fetchall()
    cursor.close()
    db.close()
    return jsonify(result)

@app.route("/movies/genre", methods=["POST"])
def search_movies_by_genre():
    genre = request.json.get("genre").capitalize()
    db = connect_to_db()
    cursor = db.cursor()
    query = """
    SELECT m.Title, m.Year, g.GenreName
    FROM Movies m
    JOIN MovieGenres mg ON m.MovieID = mg.MovieID
    JOIN Genres g ON mg.GenreID = g.GenreID
    WHERE g.GenreName = %s;
    """
    cursor.execute(query, (genre,))
    result = cursor.fetchall()
    cursor.close()
    db.close()
    return jsonify(result)

@app.route("/movies/details", methods=["POST"])
def get_movie_details():
    title = request.json.get("title").strip()
    db = connect_to_db()
    cursor = db.cursor()
    query = """
    SELECT MovieID, Title, Year, IMDbRating, Revenue, Runtime
    FROM Movies
    WHERE Title = %s;
    """
    cursor.execute(query, (title,))
    result = cursor.fetchone()
    cursor.close()
    db.close()
    return jsonify(result)

@app.route("/movies/platform", methods=["POST"])
def find_movies_on_platform():
    platform = request.json.get("platform").strip()
    db = connect_to_db()
    cursor = db.cursor()
    query = """
    SELECT m.Title, m.Year, sp.PlatformName
    FROM Movies m
    JOIN MoviePlatforms mp ON m.MovieID = mp.MovieID
    JOIN StreamingPlatforms sp ON mp.PlatformID = sp.PlatformID
    WHERE sp.PlatformName = %s;
    """
    cursor.execute(query, (platform,))
    result = cursor.fetchall()
    cursor.close()
    db.close()
    return jsonify(result)

@app.route("/movies/advanced", methods=["POST"])
def advanced_search():
    criteria = request.json
    db = connect_to_db()
    cursor = db.cursor()

    if criteria.get("type") == "genre":
        query = """
        SELECT m.Title, m.Year, g.GenreName
        FROM Movies m
        JOIN MovieGenres mg ON m.MovieID = mg.MovieID
        JOIN Genres g ON mg.GenreID = g.GenreID
        WHERE g.GenreName = %s;
        """
        cursor.execute(query, (criteria["value"],))
    elif criteria.get("type") == "rating":
        query = """
        SELECT Title, Year, IMDbRating
        FROM Movies
        WHERE IMDbRating >= %s;
        """
        cursor.execute(query, (criteria["value"],))
    elif criteria.get("type") == "revenue":
        query = """
        SELECT Title, Year, Revenue
        FROM Movies
        WHERE Revenue BETWEEN %s AND %s;
        """
        cursor.execute(query, (criteria["min"], criteria["max"]))
    
    result = cursor.fetchall()
    cursor.close()
    db.close()
    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True)
