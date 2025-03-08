from flask import Flask, json, request, jsonify
from resume_parser import extract_text
from ai_matcher import match_resume
from storage import save_candidate, get_candidates
from flask_cors import CORS  
import os
from dotenv import load_dotenv

load_dotenv()


app = Flask(__name__)
app.secret_key = os.getenv("APP_SECRET_KEY")
CORS(app)  


@app.route("/upload", methods=["POST"])
def upload_resume():
    file = request.files["resume"]
    job_desc = request.form["job_desc"]
    resume_text = extract_text(file)
    score = match_resume(resume_text, job_desc)
    
    candidate = {
        "name": file.filename,
        "resume_text": resume_text,
        "match_score": score,
        "status": "Pending"
    }
    save_candidate(candidate)
    
    return jsonify({"message": "Resume processed", "score": score})

@app.route('/candidates', methods=['GET'])
def get_candidates():
    file_path = "./data/candidates.json"

    # Check if the file exists, if not, create an empty one
    if not os.path.exists(file_path):
        with open(file_path, "w") as f:
            json.dump([], f)

    # Now read from the file safely
    try:
        with open(file_path, "r") as f:
            candidates = json.load(f)
        return jsonify(candidates)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/candidates/<name>', methods=['DELETE'])
def delete_candidate(name):
    file_path = "./data/candidates.json"

    try:
        with open(file_path, "r") as f:
            candidates = json.load(f)

        # Find and remove the candidate by name
        updated_candidates = [candidate for candidate in candidates if candidate["name"] != name]

        # Save the updated list back to the file
        with open(file_path, "w") as f:
            json.dump(updated_candidates, f, indent=4)

        return jsonify({"message": f"Candidate '{name}' deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
if __name__ == "__main__":
    app.run(debug=False)
