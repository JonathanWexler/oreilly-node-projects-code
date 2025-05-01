# Use official LTS Node.js base image (2025 default)
FROM node:20

# Create app directory
WORKDIR /usr/src/app

# Copy package files first for better Docker cache use
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the project
COPY . .

# Expose port (optional: override in docker-compose)
EXPOSE 3000

# Start the application
CMD [ "npm", "start" ]
