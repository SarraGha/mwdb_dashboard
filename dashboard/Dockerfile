FROM python:3.12-slim

# Create app directory
WORKDIR /app

# Install Streamlit and requests
COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy app
COPY . .

# Set Streamlit config to allow external access
ENV STREAMLIT_SERVER_HEADLESS=true
ENV STREAMLIT_SERVER_PORT=8501
ENV STREAMLIT_SERVER_ENABLECORS=false

EXPOSE 8501

CMD ["streamlit", "run", "app.py"]
