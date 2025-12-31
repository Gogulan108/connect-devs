# USER - AuthRouter

- POST /signup
- POST /login
- POST /logout

# Profile - ProfileRouter

- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password

# Connection ->ConnectionRequestRouter

- POST /request/send/interested/:userId
- POST /request/send/ignored/:userId
- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requestId

# Connection -> UserConnectionRouter

- GET /connections -> All connections
- GET /request/received - Received connection request
- GET /request/sent - Sent connection request
- DELETE /request/remove/sentrequest

- GET /feeds - get all the users
