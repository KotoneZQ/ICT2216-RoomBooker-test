@echo off
rem Start the Flask backend
rem Install React dependencies and wait for completion
START /WAIT "" cmd /c "python3 -m venv .venv && .\.venv\Scripts\activate && pip install -r backend/requirements.txt"

START /B "" cmd /k ".\.venv\Scripts\activate && .\.venv\Scripts\python.exe "backend\main.py""

rem Start the Next.js frontend
START "" cmd /k "cd roombooker\material-ui-nextjs && npm i && npm run dev"
