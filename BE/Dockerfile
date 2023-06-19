FROM node:18

WORKDIR /app/

COPY package*.json /

RUN npm install prettier -g

RUN npm install

COPY . .

RUN npm run build

EXPOSE 8000

RUN chmod +x ./scripts/wait-for-it.sh

# Development
CMD ["bash", "./scripts/start-app.sh"]

# Production
# RUN npm install -g pm2
# CMD ["pm2-runtime", "ecosystem.config.js", "--env", "production"]