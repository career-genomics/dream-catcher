ARG python_version=3.13
FROM python:3.13-slim


WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    && rm -rf /var/lib/apt/lists/*

COPY ../requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt
RUN mkdir -p backend
COPY . backend/


EXPOSE 8080
CMD ["uvicorn", "backend.api.main:app", "--host", "0.0.0.0", "--port", "8080"]