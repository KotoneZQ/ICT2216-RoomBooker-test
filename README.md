# Prerequisite
- Node.js
- Python
- MySQL Server

# Setting Up
### 1. Clone the Repository
`git clone https://github.com/aloysiustayy/ICT2216-RoomBooker.git`
### 2. Create Local Database Schema 
Create a local database schema called `"roombooker"` in your MySQL server.
### 3. Update MySQL Credentials 
Update the MySQL login credentials in `backend/sql_app/database.py` file to match your local setup.
### 4. Set Up Virtual Environment
Create and activate a virtual environment in the root folder:\
`python -m venv .venv`\
`source .venv/bin/activate   # On Windows, use .venv\Scripts\activate`
### 5. Install Dependencies
Install the required Python packages:\
`pip install -r backend/requirements.txt`

Install the required Node Modules:\
`cd roombooker/material-ui-nextjs`\
`npm install`

### 6. Run the Application
Execute the `run.bat` file to start both the backend (FastAPI) on port 8000 and the frontend (Next.js) on port 3000.
### 7. Execute SQL Scripts
Once both the backend and frontend are running, execute the two SQL scripts located in `backend/sql_scripts` in your roombooker database.

# Additional Notes
- Ensure your MySQL server is running and accessible before starting the application.
- If you encounter any issues, check the logs for more detailed error messages and adjust configurations accordingly.

