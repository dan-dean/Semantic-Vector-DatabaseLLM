import re
import marqo

mq = marqo.Client(url='http://localhost:8882')

# mq.create_index("book-of-mormon-db", model="hf/all_datasets_v4_MiniLM-L6")

def split_verses(text, max_verses=5, max_words=150):
    verse_pattern = re.compile(r'(\d+:\d+) (.*?)\n')
    current_verses = []
    current_words = []

    for verse_number, verse_text in verse_pattern.findall(text):
        current_verses.append(verse_number)
        current_words.append(f"{verse_number} {verse_text}")

        if len(current_verses) >= max_verses or len(' '.join(current_words).split()) >= max_words:
            yield ' '.join(current_words), current_verses
            current_verses, current_words = [], []

    # Yield remaining verses if any
    if current_verses:
        yield ' '.join(current_words), current_verses

def process_book(book_name, text):
    documents = []
    chapter_pattern = re.compile(rf'{re.escape(book_name)} Chapter (\d+)\n')

    chapters = chapter_pattern.split(text)
    for i in range(1, len(chapters), 2):
        chapter_number = chapters[i]
        chapter_text = chapters[i + 1]

        for verse_text, verse_numbers in split_verses(chapter_text):
            verse_range = f"{chapter_number}:{verse_numbers[0].split(':')[1]}-{verse_numbers[-1].split(':')[1]}"
            document_name = f"{book_name} {verse_range}"
            documents.append({
                "Title": document_name,
                "Description": verse_text,
                "BookName": book_name,
                "Chapter": chapter_number,
                "Verses": verse_numbers
            })

    return documents

# Collect inputs from the user
book_name = input("Enter the Book Name: ")

# Read book text from a file named 'BookName.txt'
file_name = f"input/{book_name}.txt"
with open(file_name, 'r') as file:
    book_text = file.read()

# Process the book
documents = process_book(book_name, book_text)

# Print documents for review
# for doc in documents:
#     print(doc)
#     input("Press Enter to continue...")  # Pause for review

# insert into index
for document in documents:
    mq.index("book-of-mormon-db").add_documents([
    document],
    tensor_fields=["Title", "Description"],
    auto_refresh=True
)
    

print(mq.index("book-of-mormon-db").get_stats())