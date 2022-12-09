# Node.js Boilerplate

Some decription

## Features

**Server-side**

-   [x] **[Node.JS](https://nodejs.org)** v10.x.x
-   [x] **[Express](https://github.com/expressjs/express)**
-   [x] [MongoDB](https://www.mongodb.com/) with [Mongoose](https://github.com/Automattic/mongoose)
-   [x] [NodeMailer](https://github.com/nodemailer/nodemailer) with SMTP, MailGun or SendGrid
-   [x] [Helmet](https://github.com/helmetjs/helmet)
-   [x] [Express-validator](https://github.com/ctavan/express-validator)
-   [x] [winston](https://github.com/winstonjs/winston) + 6 transports

**Client-side**

-   [x] **[Vue3](https://github.com/vuejs/vue)**
-   [x] [Vuex](https://github.com/vuejs/vuex)
-   [x] [Vue-router](https://github.com/vuejs/vue-router)
-   [x] [axios](https://github.com/mzabriskie/axios)
-   [x] **[Webpack 4](https://github.com/webpack/webpack)**
-   [x] [SCSS](http://sass-lang.com/)
-   [x] [Babel](https://babeljs.io/)
-   [x] [Passwordless](https://www.sitepoint.com/passwordless-authentication-works/) mode
-   [x] [Passport.JS](http://passportjs.org/)
    -   Social signup/login with Facebook, Google, Twitter and Github
    -   API key authentication for REST API calls

**Supported remote logging services**

-   [x] [Papertrail](https://papertrailapp.com/)
-   [x] [Graylog](https://www.graylog.org/)
-   [x] [LogEntries](https://logentries.com/)
-   [x] [Loggly](https://www.loggly.com/)
-   [x] [Logsene](https://sematext.com/logsene/)
-   [x] [Logz.io](http://logz.io/)

## Usage

Install dependencies

```
npm install
```

or

```
yarn
```

For development

```bash
npm run dev
```

Build web app scripts and styles:

```bash
npm run build
```

For production

```bash
npm start
```

## Docker

Building the images for the first time

```
docker-compose build
```

Starting the images

```
docker-compose up
```

## Directory structure

```txt
+---apps
|   +---client
|   |   |  index.js
|
+---server
|   |   index.js
|   +---config
|   |       default.js
|   |       index.js
|   |       prod.js
|   |       test.js
|   |
|   +---core
|   +---utils
|   +---models
|   |    |  USER
|   |    |  |  user.js
|   |
|   +---routes
|   +---services
|
+---tests

```

## Obtaining API keys for social signup/login

![Google Logo](https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/128px-Google_2015_logo.svg.png)

These are the instructions for Google:

-   Visit [Google Cloud Console](https://cloud.google.com/console/project)
-   Click on the **Create Project** button
-   Enter _Project Name_, then click on **Create** button
-   Then click on _APIs & auth_ in the sidebar and select _API_ tab
-   Click on **Google+ API** under _Social APIs_, then click **Enable API**
-   Next, under _APIs & auth_ in the sidebar click on _Credentials_ tab
-   Click on **Create new Client ID** button
-   Select _Web Application_ and click on **Configure Consent Screen**
-   Fill out the required fields then click on **Save**
-   In the _Create Client ID_ modal dialog:
-   **Application Type**: Web Application
-   **Authorized Javascript origins**: <http://localhost:3000>
-   **Authorized redirect URI**: <http://localhost:3000/auth/google/callback>
-   Click on **Create Client ID** button
-   Copy and paste _Client ID_ and _Client secret_ keys into `config.js` file

![Facebook Logo](https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Facebook_New_Logo_%282015%29.svg/128px-Facebook_New_Logo_%282015%29.svg.png)

These are the instructions for Facebook:

-   Visit [Facebook Developers](https://developers.facebook.com/)
-   Click **My Apps**, then select \*_Add a New App_ from the dropdown menu
-   Select **Website** platform and enter a new name for your app
-   Click on the **Create New Facebook App ID** button
-   Choose a **Category** that best describes your app
-   Click on **Create App ID** button
-   In the upper right corner click on **Skip Quick Star**
-   Copy and paste _App ID_ and _App Secret_ keys into `config.js` file
-   **Note:** _App ID_ is **clientID**, _App Secret_ is **clientSecret**
-   Click on the _Settings_ tab in the left nav, then click on **+ Add Platform**
-   Select **Website**
-   Enter `http://localhost:3000` under _Site URL_

**Note:** After a successful sign in with Facebook, a user will be redirected back to home page with appended hash `#_=_` in the URL. It is _not_ a bug. See this [Stack Overflow](https://stackoverflow.com/questions/7131909/facebook-callback-appends-to-return-url) discussion for ways to handle it.

**Update:** Added a commented workaround to App.vue, otherwise the FB users may end up on a blank page on redirect.

![GitHub Logo](https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/GitHub_logo_2013_padded.svg/128px-GitHub_logo_2013_padded.svg.png)

These are the instructions for GitHub:

-   Go to [Account Settings](https://github.com/settings/profile)
-   Select **Applications** from the sidebar
-   Then inside **Developer applications** click on **Register new application**
-   Enter _Application Name_ and _Homepage URL_
-   For _Authorization Callback URL_: <http://localhost:3000/auth/github/callback>
-   Click **Register application**
-   Now copy and paste _Client ID_ and _Client Secret_ keys into `config.js` file

![Twitter Logo](https://upload.wikimedia.org/wikipedia/en/thumb/9/9f/Twitter_bird_logo_2012.svg/64px-Twitter_bird_logo_2012.svg.png)

These are the instructions for Twitter:

-   Sign in at [https://apps.twitter.com/](https://apps.twitter.com/)
-   Click **Create a new application**
-   Enter your application name, website and description
-   For **Callback URL**: <http://127.0.0.1:3000/auth/twitter/callback>
-   Go to **Settings** tab
-   Under _Application Type_ select **Read and Write** access
-   Check the box **Allow this application to be used to Sign in with Twitter**
-   Click **Update this Twitter's applications settings**
-   Copy and paste _Consumer Key_ and _Consumer Secret_ keys into `config.js` file
