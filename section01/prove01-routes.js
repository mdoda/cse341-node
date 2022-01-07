const fs = require("fs");

const newUsers = ["user 1", "user 2"];

const requestHandler = (req, res) => {
  const url = req.url;
  const method = req.method;
 
  let username = "";
  if (url === '/') {
    res.write("<html>");
    res.write("<head><title>Prove 01</title></head>");
    res.write(
      '<body><p>Welcome to Prove 01</p><form action="/create-user" method="POST"><input type="text" name="username"><button type="submit">Send</button></form></body>'
    );
    res.write("</html>");
    return res.end();
  }
  if (url === '/users') {
    res.setHeader("Content-Type", "text/html");
    res.write("<html>");
    res.write("<head><title>Assignment 1</title></head>");
    console.log(newUsers)
    res.write("<body><ul>")
    for(user of newUsers){
        res.write("<li>");
        res.write(user);
        res.write("</li>");
    }
    res.write("</ul></body>");
    res.write("</html>");
    return res.end();
  }
  if (url === '/create-user') {
    const body = [];
    req.on("data", (chunk) => {
      body.push(chunk);
    });
    req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString();
      //console.log(parsedBody); // username=whatever_the_username_is
      username = parsedBody.split("=")[1];
      console.log(username); // username=whatever_the_username_is
      newUsers.push(username);
      console.log(newUsers)
    });
    console.log(newUsers)
    res.statusCode = 302;
    res.setHeader('Location', '/');
    res.end();
  }
};



module.exports = requestHandler;

// module.exports = {
//     handler: requestHandler,
//     someText: 'Some hard coded text'
// };

// module.exports.handler = requestHandler;
// module.exports.someText = 'Some text';

// exports.handler = requestHandler;
// exports.someText = 'Some hard coded text';
