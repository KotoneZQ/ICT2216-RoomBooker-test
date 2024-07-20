
# # Use an official Python runtime as a parent image
# FROM python:3.9-alpine

# # Define build-time variables
# ARG DB_HOST
# ARG DB_PASSWORD
# ARG DB_NAME
# ARG admin_email
# ARG admin_password
# ARG STRIPE_SECRET_KEY
# ARG FRONTEND_BASE_URL
# ARG DB_USERNAME
# ARG DB_PORT

# # Set the working directory
# WORKDIR /app

# # Set environment variables
# ENV admin_email=${admin_email}
# ENV admin_password=${admin_password}
# ENV STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY}
# ENV FRONTEND_BASE_URL=${FRONTEND_BASE_URL}
# ENV DB_HOST=${DB_HOST}
# ENV DB_PASSWORD=${DB_PASSWORD}
# ENV DB_NAME=${DB_NAME}
# ENV DB_USERNAME=${DB_USERNAME}
# ENV DB_PORT=${DB_PORT}

# # Copy the current directory contents into the container at /app
# COPY . /app

# # Create a virtual environment and install dependencies
# RUN python3 -m venv venv && \
#     . venv/bin/activate && \
#     pip install --upgrade pip && \
#     pip install -r requirements.txt


# # # Run tests
# # RUN . venv/bin/activate && \
# #     export PYTHONPATH=. && \
# #     pytest tests/ -v

# # # Expose the port that the app runs on
# # EXPOSE 8000

# # Install wait-for-it.sh
# RUN apk add --no-cache bash curl
# ADD https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh /wait-for-it.sh
# RUN chmod +x /wait-for-it.sh

# # Copy the built React app from the frontend stage
# COPY --from=frontend /frontend/.next /app/frontend/.next
# COPY --from=frontend /frontend/public /app/frontend/public
# COPY --from=frontend /frontend/node_modules /app/frontend/node_modules
# COPY --from=frontend /frontend/package*.json /app/frontend/

# # Install serve to serve the built React app
# RUN npm install -g serve

# # Expose the ports
# EXPOSE 8000
# EXPOSE 3000

# # Run the FastAPI and Next.js applications in the background and then run tests
# RUN . venv/bin/activate && \
#     uvicorn main:app --host 0.0.0.0 --port 8000 & \
#     serve -s frontend -l 3000 & \
#     /wait-for-it.sh localhost:8000 -- /wait-for-it.sh localhost:3000 -- \
#     pytest -v tests/ -v && \
#     pkill -f "uvicorn" && \
#     pkill -f "serve"

# # Run the application
# CMD ["sh", "-c", ". venv/bin/activate && uvicorn main:app --host 0.0.0.0 --port 8000"]


# Stage 1: Build React app
# FROM node:18-alpine AS frontend

# WORKDIR /frontend

# # Copy frontend code
# COPY roombooker/material-ui-nextjs/package*.json ./
# RUN npm install

# COPY roombooker/material-ui-nextjs .

# RUN chmod +x /frontend/run_frontend.sh
# RUN tr -d "\r" < /frontend/run_frontend.sh > /frontend/run_frontendnew.sh

# RUN chmod +x /frontend/run_frontendnew.sh
# # Run the tests
# RUN /frontend/run_frontendnew.shdd


# # Stage 2: Build FastAPI app
# # FROM python:3.9-alpine AS backend
# FROM python:3.9-slim-buster AS backend

# # Define build-time variables
# ARG DB_HOST
# ARG DB_PASSWORD
# ARG DB_NAME
# ARG admin_email
# ARG admin_password
# ARG STRIPE_SECRET_KEY
# ARG FRONTEND_BASE_URL
# ARG DB_USERNAME
# ARG DB_PORT



# # Set environment variables
# ENV admin_email=${admin_email}
# ENV admin_password=${admin_password}
# ENV STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY}
# ENV FRONTEND_BASE_URL=${FRONTEND_BASE_URL}
# ENV DB_HOST=${DB_HOST}
# ENV DB_PASSWORD=${DB_PASSWORD}
# ENV DB_NAME=${DB_NAME}
# ENV DB_USERNAME=${DB_USERNAME}
# ENV DB_PORT=${DB_PORT}

# # Install system dependencies for playwright
# RUN apt-get update && apt-get install -y \
#     chromium \
#     libnss3 \
#     libatk1.0-0 \
#     libatk-bridge2.0-0 \
#     libcups2 \
#     libxkbcommon-x11-0 \
#     libgbm-dev \
#     libasound2 \
#     libpangocairo-1.0-0 \
#     wget \
#     --no-install-recommends && \
#     rm -rf /var/lib/apt/lists/*

    
# WORKDIR /frontend

# EXPOSE 3000

# # Copy frontend code
# # COPY roombooker/material-ui-nextjs/package*.json ./
# # RUN npm install

# COPY roombooker/material-ui-nextjs /frontend

# RUN chmod +x /frontend/run_frontend.sh
# RUN tr -d "\r" < /frontend/run_frontend.sh > /frontend/run_frontendnew.sh

# RUN chmod +x /frontend/run_frontendnew.sh
# # Run the tests
# RUN /frontend/run_frontendnew.sh


# # Set the working directory
# WORKDIR /app

# # Copy the backend directory contents into the container at /app
# COPY backend /app

# # Create a virtual environment and install dependencies
# RUN python3 -m venv venv && \
#     . venv/bin/activate && \
#     pip install --upgrade pip && \
#     ls -l && \
#     pip install -r /app/requirements.txt && \
#     playwright install

# # Install wait-for-it.sh
# ADD https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh /wait-for-it.sh
# RUN chmod +x /wait-for-it.sh

# Copy the built React app from the frontend stage
# COPY --from=frontend /frontend/.next /app/frontend/.next
# COPY --from=frontend /frontend/public /app/frontend/public
# COPY --from=frontend /frontend/node_modules /app/frontend/node_modules
# COPY --from=frontend /frontend/package*.json /app/frontend/

# Install serve to serve the built React app
# RUN npm install -g serve

# CMD ["sh", "-c", ". venv/bin/activate && uvicorn main:app --host 0.0.0.0 --port 8000 &"]
# CMD ["sh", "-c", "npm run dev &"]

# CMD ["sh", "-c", "echo FastAPI and Nextjs running?"]
# RUN . venv/bin/activate && uvicorn main:app --host 0.0.0.0 --port 8000 &
# RUN . venv/bin/activate && cd ../ && ls -l && npm run dev &


# Copy the test script


# Expose the ports
# EXPOSE 8000


# RUN chmod +x /app/run_test.sh
# RUN tr -d "\r" < /app/run_test.sh > /app/run_testnew.sh

# RUN chmod +x /app/run_testnew.sh
# # Run the tests
# RUN /app/run_testnew.sh

# Run the FastAPI and Next.js applications in the background and then run tests
# RUN . venv/bin/activate && \
#     export PYTHONPATH=app && \
#     ls -la && \
#     # uvicorn main:app --host 0.0.0.0 --port 8000 & \
#     # cd /frontend 
#     # && npm run dev & \
#     /wait-for-it.sh localhost:8000 -- /wait-for-it.sh localhost:3000 -- && \
#     pytest app/tests/ -v && \
#     pkill -f "uvicorn" && \
    # pkill -f "npm run dev"

# Stage 1: Build the frontend
FROM node:18-alpine AS frontend

WORKDIR /frontend

# Copy frontend code
# COPY roombooker/material-ui-nextjs/package*.json ./

# RUN npm install

COPY roombooker .

# Debug: List the contents of the frontend directory after copying
RUN echo "Listing contents of /frontend after copying source files:" && ls -la /frontend
RUN echo "Listing contents of /frontend/material-ui-nextjs after copying source files:" && ls -la /frontend/material-ui-nextjs

# Change to the material-ui-nextjs directory and install dependencies
WORKDIR /frontend/material-ui-nextjs
RUN npm install

RUN echo "Listing contents of /frontend/material-ui-nextjs after npm install:" && ls -la /frontend/material-ui-nextjs


# Stage 2: Build the backend
FROM python:3.13.0b2-slim AS backend

# Install Node.js and npm from NodeSource
RUN apt-get update && apt-get install -y \
    chromium \
    libnss3 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libxkbcommon-x11-0 \
    libgbm-dev \
    libasound2 \
    libpangocairo-1.0-0 \
    wget \
    curl \
    bash \
    --no-install-recommends && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    rm -rf /var/lib/apt/lists/*

# Set working directory for backend
WORKDIR /app

### Define build-time variables ###
# Backend env var
ARG DB_HOST
ARG DB_PASSWORD
ARG DB_NAME
ARG admin_email
ARG admin_password
ARG STRIPE_SECRET_KEY
ARG FRONTEND_BASE_URL
ARG DB_USERNAME
ARG DB_PORT

# Frontend env var
ARG NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
ARG BACKEND_API_URL
ARG NEXT_PUBLIC_SESSION_PASSWORD

# ARG random_num=1

### Set environment variables ###
ENV admin_email=${admin_email}
ENV admin_password=${admin_password}
ENV STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY}
ENV FRONTEND_BASE_URL=${FRONTEND_BASE_URL}
ENV DB_HOST=${DB_HOST}
ENV DB_PASSWORD=${DB_PASSWORD}
ENV DB_NAME=${DB_NAME}
ENV DB_USERNAME=${DB_USERNAME}
ENV DB_PORT=${DB_PORT}
ENV NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=${NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}
ENV BACKEND_API_URL='http://localhost:8000'
ENV NEXT_PUBLIC_SESSION_PASSWORD=${NEXT_PUBLIC_SESSION_PASSWORD}
# ENV random_num=${random_num}
# Copy backend code, including run_tests.sh
COPY backend .

# Copy the entire frontend directory from the frontend stage
COPY --from=frontend /frontend /app/frontend

# Create a virtual environment and install dependencies
RUN python3 -m venv venv && \
    . venv/bin/activate && \
    pip install --upgrade pip && \
    pip install -r requirements.txt && \
    playwright install

# Ensure run_tests.sh is executable
RUN chmod +x run_tests.sh

# Expose the ports
EXPOSE 8000
EXPOSE 3000

# Run the tests
RUN ./run_tests.sh
# RUN echo "Running tests - random_num ${random_num}" && ./run_tests.sh

# Run the applications
CMD ["sh", "-c", ". venv/bin/activate && uvicorn main:app --host 0.0.0.0 --port 8000"]
