🟢 Learned about the mongoose connect thru compass and made it as a module to use it at     server.
🟢 worked on get  and post method in which to perform the post we need to set up the app to use express.json.
🟢  Learned about the middleware which is next() in each route or api handler, which validates the routes thru authorization and authentication and passes to next route, if it is a valid user. We can also pass it as a second parameter in the route itself with a explicit function to check individual routes for modular and efficient check.
🟢 Started working on the delete and update methods.
🟢learned about schema vs api validation, in schema we will be defining,required,min,max,default,lowercase,unique,validate.
🟢in post method of create() or save, we don't need to pass runvalidator, since it is a auto taken. but for any model method like findbyidupdate post method, we need to pass 3rd parameter as runvalidator as true.
🟢should restrict the email or password update by filtering only the updateable fields and update.
🟢sanitize everything on the req.body
🟢have a api level validation if the any field is getting transformed before putting the db.
🟢schema level is good for data which are getting into without any transformation.