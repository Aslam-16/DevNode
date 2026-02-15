# DevTinder APIs

## auth routes
POST /auth/signup - done
POST /auth/login - done
POST /auth/forgotpassword
POST /auth/logout - done

## profile auth
GET /profile/view - done
POST /profile/edit - done
POST /profile/changepassword - done

## MAIN APIs
## user/request routes
GET /user/feed - done
GET /user/requestreceived
GET /user/requestsent
POST /connection/interested/:userid
POST /connection/ingored/:userid
POST /connection/accepted/:requestid
POST /connection/rejected/:requestid
