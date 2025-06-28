#First --> importing libraries

import os #os is a python library that contains methods to interact with the computer operating system
import nltk #nltk is a python library that will help build this program work with human language data
import ssl #secure sockets layer --> basically security for the application
import streamlit as st #connection between coding in python and the web application later on
import random #RNG --> helps with how the chatbot will respond to what you will say to it
from sklearn.feature_extraction.text import TfidfVectorizer 
from sklearn.linear_model import LogisticRegression

ssl._create_default_https_context = ssl._create_unverified_context
nltk.data.path.append(os.path.abspath("nltk)_data"))
nltk.download('punkt')
#lines above deal with NLTK data

#contents of the chatbot
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

#creation of ML model for the chatbot
vectorizer = TfidfVectorizer() #this is key in creating a machine learning model, utilizing a class from the sci-kit learn
clf = LogisticRegression(random_state = 0, max_iter = 10000)
#random_state is basically the RNG factor
#max_iter is an optimization algorithm --> reads for max iterations with intent to minimize error

#a preprocessing of the data
tags = []
patterns = []
for intent in intents:
    for pattern in intent['patterns']:
        tags.append(intent['tag'])
        patterns.append(pattern)
#first observation = for each within a for each --> iterating through the manual created data
#this section of code works hand in hand with the Logistic Regression --> it reads through all the data to start learning patterns, etc.

x = vectorizer.fit_transform(patterns)
y = tags
clf.fit(x, y)
#this section of code is basically interpreting human language
#using the vectorizer we created above --> human language is turned into TF-IDF vectors
#it creates association with tags, and from there, the ML model learns
#TF-IDF vectors can now be related by the bot to certain extents and interpret input

#function to receive input
def jordsterbot(input_text):
    input_text = vectorizer.transform([input_text])
    tag = clf.predict(input_text)[0]
    for intent in intents:
        if intent['tag'] == tag:
            response = random.choice(intent['responses'])
            return response

counter = 0

def main():
    global counter
    st.title("Jordster's League Bot")
    st.write("Welcome! Let's ARAM!")

    counter += 1
    user_input = st.text_input("You:", key=f"user_input_{counter}")

    if user_input:
        response = jordsterbot(user_input)
        st.text_area("Chatbot:", value=response, height=100, max_chars=None, key=f"chatbot_response_{counter}")

        if response.lower() in ['goodbye', 'bye']:
            st.write("Thank you for chatting with me. Have a great day!")
            st.stop()

if __name__ == '__main__':
    main()

#simple sequence of conditionals to determine what the chatbot will do
#uses the jordsterbot function in order to receive input


