from flask import Flask, request, jsonify, Response
from flask_cors import CORS
from queue import Queue
import threading
from threading import Thread
from threading import Semaphore
import time
import json
import marqo
import os
import requests

mq = marqo.Client(url='http://localhost:8882')

app = Flask(__name__)
CORS(app)

message_queue = Queue()

semaphore = Semaphore(1)

def extract_content(response_json):
    # Assuming response_json is a dictionary already parsed from JSON
    try:
        # Accessing the first choice and its message content
        content = response_json['choices'][0]['message']['content']
        return content
    except (KeyError, IndexError, TypeError) as e:
        # Handle cases where the structure might be different or fields are missing
        print(f"Error extracting content: {e}")
        return None

def query_llm_studio(message):
    url = "http://localhost:1234/v1/chat/completions"
    headers = {"Content-Type": "application/json"}
    data = {
        "messages": [
            { "role": "system", "content": "You are a helpful scriptural reference chatbot. You respond to user's queries and provide scriptural references. Below is a query. Respond to the query in a thoughtful and spiritual manner given the scriptural context that follows the query. Cite verses from the given context by quoting specific verses. Be sure to QUOTE the verses you wish to cite, don't just paraphrase. Do not reference any outside scripture, only refer to the given query and context." },
            {"role": "user", "content": message}
        ],
        "temperature": 0.7,
        "max_tokens": -1,
        "stream": False
    }

    response = requests.post(url, headers=headers, data=json.dumps(data))
    if response.ok:
        return response.json()
    else:
        # Handle error
        print("Error querying LLM system:", response.status_code, response.text)
        return None

# query endpoint
@app.route('/query', methods=['POST'])
def handle_query():
    if not semaphore.acquire(blocking=False):
        return jsonify({'result': 'Server is busy'}), 503
    
    data = request.json
    query = data.get('query')
    print("query recieved: ",query)
    Thread(target=process_query, args=(query,)).start()
    #debug return jsonify({'result': 'Response from the server'})
    return jsonify({'result': 'Query Recieved'})

def process_query(query):
    global is_busy
    try:
        message_queue.put(json.dumps({'message': 'Querying the database...'}))
        
        data = mq.index("book-of-mormon-db").search(q=query, searchable_attributes=["Description"], limit=3)

        context_string = "\n\n".join(f"{hit['Title']}:\n{hit['Description']}" for hit in data['hits'])

        print(context_string)

        composed_query = query + "\n" + context_string

        message_queue.put(json.dumps({'message': 'References found. Querying LLM...'}))
        
        response = query_llm_studio(composed_query)

        if response:
            #final response
            sanitized_response = extract_content(response)
            final_response = sanitized_response + "\n\nReferences:\n" + context_string
            print(sanitized_response)
            message_queue.put(json.dumps({'message': 'Process complete!', 'result': final_response, 'final': True}))
        else:
            message_queue.put(json.dumps({'message': 'Process complete!', 'result': "LLM generation failed. May be offline", 'final': True}))


    finally:
        semaphore.release()


    

# update endpoint
def event_stream():
    while True:
        message_json = message_queue.get()
        yield "data:" + message_json + "\n\n"
        
        message_data = json.loads(message_json)
        if message_data.get('final', False):
            break

@app.route('/status')
def status():
    return Response(event_stream(), mimetype='text/event-stream')


if __name__ == '__main__':
    app.run(debug=True, port=32628, host="0.0.0.0")
