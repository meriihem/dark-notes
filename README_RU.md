# Dark Notes Web

Веб-версия заметок для телефона: тёмный интерфейс, поиск, категории, избранное, создание/редактирование/удаление и синхронизация через Firebase Authentication + Cloud Firestore.

## 1. Добавить Web-приложение в существующий Firebase-проект

1. Открой https://console.firebase.google.com/ и выбери `dark-notes-939ce`.
2. На странице обзора проекта нажми значок `</>` (Add app → Web).
3. Назови приложение `Dark Notes Web`.
4. Зарегистрируй приложение. Firebase покажет объект `firebaseConfig`.
5. Скопируй весь объект `firebaseConfig` (apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId).

Не создавай новый Firebase-проект: используй существующий `dark-notes-939ce`.

## 2. Открыть веб-приложение

Для работы ES-модулей Firebase страницу нужно открыть с HTTPS-хостинга, а не как локальный `file://` файл. Самый простой вариант — загрузить `index.html` в GitHub Pages, Netlify или Firebase Hosting.

В этой сборке конфигурация Firebase уже встроена. После публикации открой HTTPS URL на телефоне: приложение автоматически подключится к проекту `dark-notes-939ce`.

## 3. Firebase настройки

- Authentication → Sign-in method → Anonymous: должен быть включён.
- Firestore Database → Rules: опубликуй правила ниже (они соответствуют пути, который использует веб-приложение).

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/notes/{noteId} {
      allow read, create, update, delete:
        if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Важно про синхронизацию между устройствами

Текущая версия использует анонимную авторизацию. UID сохраняется в браузере, поэтому заметки синхронизируются в этом браузере и его профиле. Чтобы безопасно получать один и тот же набор заметок на разных устройствах, нужно добавить привязку анонимной учётной записи к Google или email/password. Не очищай данные браузера до добавления постоянного способа входа.

## Размещение

Подойдёт любой HTTPS static hosting. GitHub Pages: создай репозиторий, загрузи `index.html`, затем Settings → Pages → Deploy from a branch → main / root. После публикации открой выданный HTTPS URL.
