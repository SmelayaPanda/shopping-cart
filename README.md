# Node.js / Express / Mongodb shopping cart project

1. Install scaffolding project (hbs - means Handlebar default template engine)
```
    express shopping-cart --hbs
```
2. Install dependencies
```
    npm install
```
3. Add Bootstrap .css and .js from https://getbootstrap.com/
4. Add jQuery
5. Install more featured version of Handlebars for express
```
    npm install --save express-handlebars
```
and setup new app engine - app.set('.hbs', expressHbs(...))
6. Add https://use.fontawesome.com/
7.
```
    npm install --save mongoose
```
8. Install Node.js CSRF protection middleware
(cookie tokens for HTTP session).
```
    npm install --save csurf
```
9. And for stay login in the system every new request in session (by saving token)
```
    npm install --save express-session
```
10. To handle all user authentication and signup
```
    npm install --save passport
    // choiced strategy
    npm install --save passport-local
```
11. To encrypt password
```
    npm install --save bcrypt-nodejs
```
12. The flash is a special area of the session used for storing messages
```
    npm install --save connect-flash
```
13. For validate input fields
```
    npm install --save express-validator
```