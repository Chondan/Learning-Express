# Cookie-Session (Simple cookie-based session middleware)

A user session can be stored in two main ways with cookies: on the server or on the client. **This module stores the session data on the client withing a cookie**, while a module like `express-session` stores only a session indentifier on the client within a cookie and stores the session data on the server, typically in a database.

The following points can help you choose which to use:
- `cookie-session` does not require any database/resources on the server side, though the total session data cannot exceed the browser's max cookie size.
- `cookie-session` can simplify certain load-balanced scenarios.
- `cookie-session` can be used to store a "light" session and include an indentifier to look up database-backed secondary store to reduce database lookups.

## Sematics
This module provides "guest" session, meaning any visitor will have a session, authenticated or not. If a session is new a `Set-Cookie` will be produced regardless of populating the session.

---

# Securing web cookies with signatures
How can you authenticate a user in a web system with a "Shared-Nothing" architecture when you are not sure what webserver you'll come back to for any given request?

Let's assume that you are happy to use cookies.
1. Make a request to a protected resource (lets say / article / create), get detected sa unauthenticated and therefore unauthorised and get redirected to our login page, /login 
2. Submit username and password to /login, which checks them against a database of usernames and passwords (using a secure slow one-way hash like bcrypt), if your username and password match then redirect back to the original url.
3. Request the original url, now with an authentication token, which detects that you are authorised to access the url.

The user is totally in control of all 3 these requests, and we cannot keep any state on the server side so we are going to need to provide the user with the relevant data to use for all the conversation. So for example: 
1. /article/create returns a redirect to /login, with a "return-url" cookie set to "/article/create"
2. The user POST's to /login with username, password and the return-url cookie. If successful set a "username" cookie to the username and redirect to return-url.
3. The user requests/article/create now with the username cookie.

Assuming that understanding how to actually authenticate a user on the /login handler is a solved problem, the trick here is to ensure that this user flow is secure. There are two important parts.

## Authentication is not authorisation
