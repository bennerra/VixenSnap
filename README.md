# PixFlow

PixFlow - фотохостинг, поддерживающий такие форматы как .png, .jpg, .gif, .jpeg, .bmp, .webp, .svg. Реализована загрузка фотографий, mansonry-галлерея, бесконечная лента, лайки на постах, отдельные страницы с описанием каждой карточки, поиск, авторизация, oAuth, смена темы, skeleton loading

#### Technologies
- React
- Redux
- Typescript
- ESLint + Prettier
- Модульные SCSS стили
- React-hook-form
- Redux-thunk
- Craco
- Axios
- Path aliases
- Axois interceptors
- Husky

#### Getting start
1. Нужно запустить сервер разработки:

```bash
npm run dev
# or
yarn dev
```
Откройте [http://localhost:3000](http://localhost:3000) для просмотра результата.

Теперь вы можете редактировать `src/index.tsx` (При изменении любого из `src/*` файла, страница будет перезагружаться автоматически)

Для доступа к API был использован общедоступный сервис - [API](http://backend.darklorian.ru/api/v1/). 
Хэндлеры для взаимодействия, и API instance хранится в директории
`api/*`

#### Deploy
2. Для деплоя готового проекта на удаленный сервер, необходимо выполнить:
```bash
npm run build
```
И указать путь веб-сервера к готовым бандлам.

#### Development by
Elgina Anastasia - [@bennerra](https://t.me/bennerra)

