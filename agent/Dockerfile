# Use an official Python base image
FROM python:3.10-slim

# Set environment variables to prevent Python from writing .pyc files and to buffer outputs
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set the working directory inside the container
WORKDIR /app

# Install system dependencies (if needed)
RUN apt-get update && \
    apt-get install -y --no-install-recommends build-essential && \
    rm -rf /var/lib/apt/lists/*

# Copy requirements file into the container
COPY requirements.txt /app/requirements.txt

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire project into the container
COPY . /app

# Expose any necessary ports (if the agent needs to communicate over a specific port)
# EXPOSE 8080 (uncomment if needed)

# Command to start the agent
CMD ["python3", "agent.py", "start"]
