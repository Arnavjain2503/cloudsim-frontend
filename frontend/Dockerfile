# Use Node.js image as the base image
FROM node:16-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies, including dev dependencies
RUN npm install

# Copy all the application files
COPY . .

# Expose the port your app is running on (change 3000 to your app's port if needed)
EXPOSE 3000

# Start the app in development mode with live-reload
CMD ["npm", "start"]

