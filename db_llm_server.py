from flask import Flask, request, jsonify, Response
from flask_cors import CORS
from queue import Queue
import threading
from threading import Thread
from threading import Semaphore
import time
import json

app = Flask(__name__)
CORS(app)

message_queue = Queue()

semaphore = Semaphore(1)

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
        time.sleep(3)

        message_queue.put(json.dumps({'message': 'References found. Querying LLM...'}))
        time.sleep(3)

        #final response
        message_queue.put(json.dumps({'message': 'Process complete!', 'result': query, 'final': True}))
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
    app.run(debug=True, port=32628)
