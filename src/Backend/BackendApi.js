const express = require("express");
const npmview = require("npmview");
const regFetch = require("npm-registry-fetch");

const app = express();
var cors = require("cors");
app.use(cors());


const port = 3001;

app.get("/", (request, response) => {
  response.send("Hi, from Node server");
});

app.get("/outdate/:id", (request, response) => {
  const name = request.params.id;
  npmview(name, function (err, version, moduleInfo) {
    response.send(version);
  });
});

const vul = (name) => {
  let opts = {
    color: true,
    json: true,
    unicode: true,
    method: "POST",
    gzip: true,
    body: name
  };

  return regFetch("/-/npm/v1/security/audits", opts)
    .then(async (response2) => {
      response2 = await response2.json();
      return {
        v: response2.metadata.vulnerabilities.critical
      };
    })
    .catch((err) => console.error(err));
};

app.get("/audit/:id", async (req, res) => {
  const name = req.params.id;
  const d = await vul(name);
  res.send(d);
});

app.listen(port, () =>
  console.log(`server is listening at http://localhost:${port}`)
);
