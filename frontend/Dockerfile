FROM node:20-slim

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Create .env file for environment configuration if not exists
RUN if [ ! -f .env ]; then \
    echo "REACT_APP_API_BASE_URL=http://localhost:8080" > .env; \
    fi


# Expose port 3000
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]