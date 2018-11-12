FROM node:alpine

# Change working directory
# Create app directory
WORKDIR ./app

# Copy package.json
COPY package*.json ./

# Install node modules, this way we don't end up rebuilding node_modules every time
RUN npm install

# Copy app directory
COPY . .

# Expose API port to the outside
EXPOSE 3000
CMD [ "npm", "start" ]