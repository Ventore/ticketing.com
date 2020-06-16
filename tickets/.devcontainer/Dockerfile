FROM node

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm ci

COPY . .

EXPOSE 9229

CMD ["npm", "run", "debug"]