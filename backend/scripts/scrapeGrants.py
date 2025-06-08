import requests
from bs4 import BeautifulSoup
import sqlite3

# Connect to the SQLite database
db_path = './database/database.db'
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Ensure that the grants table exists
cursor.execute('''
CREATE TABLE IF NOT EXISTS grants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    organization TEXT,
    grant_amount TEXT,
    deadline TEXT,
    link TEXT
)
''')
conn.commit()

for i in range(1, 4):
    url = f'https://ngobox.org/grant_announcement_listing.php?page={i}'  # Correctly format the URL
    response = requests.get(url)

    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Extract all grant cards
        grants = soup.select('.card')  # Select all cards with grant information
        for grant in grants:
            # Extract title and link
            title_element = grant.select_one('.p_blue .card-title')
            title = title_element.text.strip() if title_element else 'Not specified'
            link = title_element['href'] if title_element else 'Not specified'
            link = f"https://ngobox.org/{link}" if link.startswith("full_grant") else link
            
            # Extract organization
            organization_element = grant.select_one('.p_balck')
            organization = organization_element.text.strip() if organization_element else 'Not specified'
            
            # Extract grant amount
            grant_amount_element = grant.select_one('.card-text2')
            grant_amount = grant_amount_element.text.replace('Grant Amount: ', '').strip() if grant_amount_element else 'Not specified'
            
            # Extract deadline
            deadline_element = grant.select_one('.list_bottumsec strong')
            deadline = deadline_element.find_next_sibling(text=True).strip() if deadline_element else 'Not specified'

            # Insert data into the database
            cursor.execute('''
            INSERT INTO grants (title, organization, grant_amount, deadline, link)
            VALUES (?, ?, ?, ?, ?)
            ''', (title, organization, grant_amount, deadline, link))

        # Commit changes after each page
        conn.commit()
        print(f'Data from page {i} has been written to the database.')
    else:
        print(f'Failed to retrieve page {i}.')

# Close the database connection
conn.close()
