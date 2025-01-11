# Backend Dockerfile for Django (server)

# Use an official Python runtime as the base image
FROM python:3.10-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set the working directory in the container
WORKDIR /app

# Install dependencies
RUN apt-get clean && \
    apt-get update && \
    apt-get install -y \
    build-essential \
    libpq-dev && \
    rm -rf /var/lib/apt/lists/*

# Copy requirements and install them
COPY requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the Django project files into the container
COPY . /app

# Collect static files
RUN python manage.py collectstatic --noinput

# Run database migrations
RUN python manage.py migrate --noinput

# Command to populate the database
RUN python manage.py import_csv

# Expose port 8000 for the Django development server
EXPOSE 8000

# Command to start the Django application
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
