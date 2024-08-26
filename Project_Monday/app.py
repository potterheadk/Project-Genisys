from flask import Flask, render_template, request, jsonify
import pickle
import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import docx2txt

app = Flask(__name__)


# Load the dataset
df = pd.read_csv('Job_opportunities.csv')

# Create TF-IDF vectorizer
tfidf_vectorizer = TfidfVectorizer(stop_words='english')
tfidf_matrix = tfidf_vectorizer.fit_transform(df['Job Description'])

# Define allowed file types
ALLOWED_EXTENSIONS = {'docx'}

# Function to check file extensions
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS



# Load the trained model
with open('model1.pkl', 'rb') as file:
    model = pickle.load(file)


# Read the dataset
df1 = pd.read_csv("Filtered_Salary_data.csv")

# Home route
@app.route('/')
def home():
    return render_template('home.html')

@app.route('/predict')
def form():
    return render_template('predict.html')

@app.route('/insights')
def index():
    return render_template('insights.html')

# insights model 
@app.route('/data')
def get_data():
    job_title = request.args.get('jobTitle')
    filtered_df = df1[df1['Job Title'] == job_title]
    data = {
        'years_experience': filtered_df['Years of Experience'].tolist(),
        'salary': filtered_df['Salary'].tolist()
    }
    return jsonify(data)




# Prediction route
@app.route('/predict', methods=['POST'])


def predict():
    # Get the input values from the form
    gre_score = int(request.form['GRE Score'])
    toefl_score = int(request.form['TOEFL Score'])
    university_rating = int(request.form['University Rating'])
    sop = float(request.form['SOP'])
    lor = float(request.form['LOR'])
    cgpa = float(request.form['CGPA'])
    research = int(request.form['Research'])
    branch = request.form['Branch']

    # Make prediction using the loaded model
    prediction = model.predict(np.array([[gre_score, toefl_score, university_rating, sop, lor, cgpa, research]]))

    # logic wala game
    if branch == 'CS':
        prediction -= 0.4
    if branch == 'ENTC':
        prediction -= 0.22
    if branch == 'Mech':
        prediction -= 0.12
    if branch == 'Civil':
        prediction += 0.05

    if university_rating == 1:
        prediction -= 0.12
    if university_rating == 2:
        prediction -= 0.05
    if university_rating == 4:
        prediction += 0.05
    if university_rating == 5:
        prediction += 0.1

    if(prediction>1):
        prediction = prediction - (prediction-1)

    # Return the predicted chance of admission
    return render_template('result.html', prediction=prediction[0])



# Create TF-IDF vectorizer
tfidf_vectorizer = TfidfVectorizer(stop_words='english')
tfidf_matrix = tfidf_vectorizer.fit_transform(df['Job Description'])

# Define allowed file types
ALLOWED_EXTENSIONS = {'docx'}

# Function to check file extensions
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/helper')
def helper():
    return render_template('helper.html')



@app.route('/compare', methods=['POST'])
def compare():
    if request.method == 'POST':
        # Check if both resume and job description files are present
        if 'resume' not in request.files or 'job' not in request.files:
            return render_template('helper.html', error='Please upload both resume and job description files.')

        resume_file = request.files['resume']
        job_file = request.files['job']

        # Check if files are empty
        if resume_file.filename == '' or job_file.filename == '':
            return render_template('helper.html', error='Please upload non-empty files.')

        # Check file extensions
        if not (allowed_file(resume_file.filename) and allowed_file(job_file.filename)):
            return render_template('helper.html', error='Only .docx files are allowed.')

        resume_text = docx2txt.process(resume_file)
        job_text = docx2txt.process(job_file)

        resume_tfidf = tfidf_vectorizer.transform([resume_text])
        job_tfidf = tfidf_vectorizer.transform([job_text])

        resume_job_similarity = cosine_similarity(resume_tfidf, job_tfidf)[0][0] * 100
        match_percentage = round(resume_job_similarity, 2)

        # Find suggested jobs
        similarity_scores = cosine_similarity(resume_tfidf, tfidf_matrix)
        top_jobs_indices = similarity_scores.argsort()[0][::-1][:5]
        suggested_jobs = df.iloc[top_jobs_indices][['Job Title', 'Job Description']]

        return render_template('helper_result.html', resume_text=resume_text, job_text=job_text, match_percentage=match_percentage, suggested_jobs=suggested_jobs.to_dict('records'))




if __name__ == '__main__':
    app.run(debug=True)
