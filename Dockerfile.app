# Используем легковесный образ Node.js
FROM node:22-alpine

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /app

# Копируем package.json и устанавливаем зависимости
COPY package.json ./
RUN npm install

# Копируем весь проект
COPY . .

# Запускаем приложение
CMD ["npm", "run", "start"]

# Открываем порт для приложения
EXPOSE 4000
