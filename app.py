# app.py

import os
from flask import Flask, request, jsonify, render_template
from PyPDF2 import PdfReader
from langchain.text_splitter import CharacterTextSplitter
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.vectorstores import FAISS
from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationalRetrievalChain
from langchain_huggingface import HuggingFaceEndpoint
from dotenv import load_dotenv

app = Flask(__name__)
load_dotenv()

# Global dictionary to store conversation chains
conversation_chains = {}

def get_pdf_text(pdf_docs):
    text = ""
    for pdf in pdf_docs:
        pdf_reader = PdfReader(pdf)
        for page in pdf_reader.pages:
            text += page.extract_text()
    return text

def get_text_chunks(text):
    text_splitter = CharacterTextSplitter(
        separator="\n",
        chunk_size=1000,
        chunk_overlap=200,
        length_function=len
    )
    chunks = text_splitter.split_text(text)
    return chunks

def get_vectorstore(text_chunks):
    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
    vectorstore = FAISS.from_texts(texts=text_chunks, embedding=embeddings)
    return vectorstore

def get_conversation_chain(vectorstore):
    repo_id = "mistralai/Mistral-7B-Instruct-v0.3"
    sec_key = os.getenv('HUGGINGFACEHUB_API_TOKEN')
    llm = HuggingFaceEndpoint(repo_id=repo_id, max_length=128, temperature=0.7, token=sec_key)

    memory = ConversationBufferMemory(memory_key='chat_history', return_messages=True)
    conversation_chain = ConversationalRetrievalChain.from_llm(
        llm=llm,
        retriever=vectorstore.as_retriever(),
        memory=memory
    )
    return conversation_chain

@app.route('/Genisys')
def index():
    return render_template('index.html')

@app.route('/home')
def home():
    return render_template('home.html')

@app.route('/contacts')  # Define the contacts route
def contacts():
    return render_template('contacts.html')

@app.route('/process', methods=['POST'])
def process():
    pdf_files = request.files.getlist('pdfs')
    raw_text = get_pdf_text(pdf_files)
    text_chunks = get_text_chunks(raw_text)
    vectorstore = get_vectorstore(text_chunks)
    conversation_chain = get_conversation_chain(vectorstore)

    # Store the conversation chain globally
    global conversation_chains
    conversation_chains['default'] = conversation_chain

    # Return a response indicating PDFs processed successfully
    response_message = "PDFs processed successfully. Ready to answer questions based on the file."
    return jsonify({"message": response_message})

@app.route('/ask', methods=['POST'])
def ask():
    user_question = request.json.get('question')
    conversation_chain = conversation_chains.get('default')
    
    if not conversation_chain:
        return jsonify({"error": "No conversation chain found."}), 400

    response = conversation_chain({'question': user_question})
    chat_history = response['chat_history']
    messages = [{'sender': 'user' if i % 2 == 0 else 'bot', 'message': msg.content} for i, msg in enumerate(chat_history)]

    return jsonify({"chat_history": messages})

if __name__ == '__main__':
    app.run(debug=True)
