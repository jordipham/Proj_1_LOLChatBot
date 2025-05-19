from flask import Flask, request, jsonify
import os
import nltk
import random
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
import ssl

ssl._create_default_https_context = ssl._create_unverified_context
nltk.data.path.append(os.path.abspath("nltk_data"))  # Adjust path as needed
nltk.download('punkt')

app = Flask(__name__)

# --- Chatbot Logic (from your original code) ---
intents = [
    {
        "tag": "greeting",
        "patterns": ["Hi", "Hello", "Hey", "How are you", "What's up"],
        "responses": ["Hi there", "Hello", "Hey", "I'm fine, thank you", "Nothing much"]
    },
    {
        "tag": "goodbye",
        "patterns": ["Bye", "See you later", "Goodbye", "Take care"],
        "responses": ["Goodbye", "See you later", "Take care"]
    },
    {
        "tag": "thanks",
        "patterns": ["Thank you", "Thanks", "Thanks a lot", "I appreciate it"],
        "responses": ["You're welcome", "No problem", "Glad I could help"]
    },
    {
        "tag": "tank",
        "patterns": ["What tank items do I build?", "Best items for tank", "Common items for tank"],
        "responses": ["Jak'sho the Protean", "Heartsteel", "Warmog's", "Force of Nature", "Thornmail"],
    },
    {
        "tag": "ADC",
        "patterns":["What adc items do I built?", "best adc items", "Common adc items", "bot lane items"],
        "responses":["IE", "BT", "galeforce", "mawl of malmortius", "QSS", "kraken slayer"],
    }
]

vectorizer = TfidfVectorizer()
clf = LogisticRegression(random_state=0, max_iter=10000)

tags = []
patterns = []
for intent in intents:
    for pattern in intent['patterns']:
        tags.append(intent['tag'])
        patterns.append(pattern)

x = vectorizer.fit_transform(patterns)
y = tags
clf.fit(x, y)

def jordsterbot(input_text):
    input_text = vectorizer.transform([input_text])
    tag = clf.predict(input_text)[0]
    for intent in intents:
        if intent['tag'] == tag:
            response = random.choice(intent['responses'])
            return response
# --- End of Chatbot Logic ---

@app.route('/chat', methods=['POST'])
def chat():
    user_message = request.json['message']
    bot_response = jordsterbot(user_message)
    return jsonify({'response': bot_response})

if __name__ == '__main__':
    app.run(debug=True) #Turn off debug in production
