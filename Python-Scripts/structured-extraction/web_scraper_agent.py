import requests
from bs4 import BeautifulSoup

def fetch_relevant_text(url, query):
    """Extract only the relevant section from Wikipedia."""
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, "html.parser")

        content_div = soup.find("div", {"id": "bodyContent"})
        if not content_div:
            return "Content not found!"

        elements = content_div.find_all(["h2", "h3", "p"])

        extracted_text = []
        capture = False  

        for tag in elements:
            if tag.name in ["h2", "h3"]:  
                heading_text = tag.get_text(strip=True)
                if query.lower() in heading_text.lower():
                    capture = True  
                else:
                    capture = False  

            if capture and tag.name == "p":  
                extracted_text.append(tag.get_text(strip=True))

        return "\n".join(extracted_text) if extracted_text else "No relevant section found!"

    except requests.exceptions.RequestException as e:
        return "Error fetching page"



def search_in_text(text, query):
    sentences = text.split(". ")  
    for sentence in sentences:
        if query.lower() in sentence.lower():
            return sentence.strip() + "."
    return "Sorry, no relevant information found."

if __name__ == "__main__":
    url = input("Enter the webpage URL: ")
    query = input("Enter your search query: ")

    page_text = fetch_relevant_text(url, query)

    if page_text:
        answer = search_in_text(page_text, query)
        print("\nSearch Result:")
        print(answer)
