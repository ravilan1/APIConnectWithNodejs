#base image
FROM node:alpine

#working directory
WORKDIR /home/metlife

#copying package file
COPY ./package.json ./

#install dependencies
RUN npm install

#copying project files
COPY ./ ./

#run node
CMD ["node", "index.js"]

