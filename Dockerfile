#Stage 1:Build Frontend
FROM node:18 AS client_build

WORKDIR /app/client
COPY client/package.json client/package-lock.json ./
RUN npm install
COPY client .
RUN npm run build


# Production stage
FROM python:3.12.3

WORKDIR /app

# Copy requirements and install dependencies
COPY server/requirements.txt .
RUN pip install gunicorn whitenoise
RUN pip install -r requirements.txt

# Copy the server code
COPY server /app
# COPY agent /app


# Create necessary directories
RUN mkdir -p /app/staticfiles /app/templates

# Copy the built client files
COPY --from=client_build /app/client/build/static /app/static
COPY --from=client_build /app/client/build/index.html /app/templates/

# Set environment variables
ENV PYTHONUNBUFFERED=1

# Collect static files
RUN python manage.py collectstatic --noinput --clear

# Run the application
# CMD ["sh", "-c", "gunicorn --bind 0.0.0.0:8000 --workers 4 --threads 2 --timeout 60 server.wsgi:application & python3 agent.py start"]
CMD ["sh", "-c", "gunicorn --bind 0.0.0.0:8000 --workers 4 --threads 2 --timeout 60 server.wsgi:application"]