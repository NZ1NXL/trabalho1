const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = 3000;
const path = require("path");
const bodyParser = require("body-parser");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

mongoose
  .connect(
    "mongodb://nicollas:mmn132000@ac-tdpdjgz-shard-00-00.hqptjty.mongodb.net:27017,ac-tdpdjgz-shard-00-01.hqptjty.mongodb.net:27017,ac-tdpdjgz-shard-00-02.hqptjty.mongodb.net:27017/?ssl=true&replicaSet=atlas-uaxsks-shard-0&authSource=admin&retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    console.log("Conexão com o banco de dados estabelecida com sucesso!");
  })
  .catch((err) => {
    console.error("Erro ao conectar ao banco de dados:", err);
  });

const carroSchema = new mongoose.Schema({
  marca: String,
  modelo: String,
  cor: String,
  kilometragem: String
});

const Carro = mongoose.model("Carro", carroSchema);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("inicio");
});

app.get("/carros", async (req, res) => {
  try {
    const carros = await Carro.find({});
    res.render("listarcarros", { carros });
  } catch (err) {
    console.error("Erro ao consultar carro no banco de dados:", err);
    res.status(500).send("Erro ao consultar carro no banco de dados");
  }
});

app.get("/carros/cadastrar", (req, res) => {
  res.render("cadastrarCarros");
});

app.post("/carros/cadastrar", async (req, res) => {
  try {
    const novoCarro = new Carro({
      marca: req.body.marca,
      modelo: req.body.modelo,
      cor: req.body.cor,
      kilometragem: req.body.kilometragem
    });

    await novoCarro.save();
    res.redirect("/carros");
  } catch (err) {
    console.error("Erro ao cadastrar carro no banco de dados:", err);
    res.status(500).send("Erro ao cadastrar carro no banco de dados");
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
