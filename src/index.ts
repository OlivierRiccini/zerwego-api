import app from "./setup/express-config";

const port = process.env.PORT || 3000;

app.listen(port, function() {
  console.log('Express server listening on port ' + port);
});