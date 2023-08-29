const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sql = require('mssql');

const app = express();

const corsOptions = {
  origin: 'http://localhost:4200', // Substitua pelo endereço do seu aplicativo Angular
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
};

app.use(cors(corsOptions));

const config = {
  user: 'pratoperfeitouser',
  password: '123456',
  server: 'localhost',
  port: 1433,
  database: 'pratoperfeito',
  options: {
    encrypt: false, // Desativar a criptografia
  },
};

// Middleware
app.use(bodyParser.json());

// Rota para buscar dados de alimentos
app.get('/api/food', (req, res) => {
  sql.connect(config, (err) => {
    if (err) {
      console.error('Erro ao conectar ao banco de dados:', err);
      return res.status(500).json({ message: 'Erro ao conectar ao banco de dados.' });
    }

    const request = new sql.Request();

    request.query('SELECT * FROM Food', (err, result) => {
      if (err) {
        console.error('Erro ao consultar o banco de dados:', err);
        sql.close();
        return res.status(500).json({ message: 'Erro ao consultar o banco de dados.' });
      }

      // Feche a conexão com o banco de dados após a consulta
      sql.close();

      // Envie os dados de alimentos como resposta
      res.json(result.recordset);
    });
  });
});








app.post('/api/recipe', async (req, res) => {
  
  const {
    foodName,
    foodDetails,
    foodImg,
    ingredientInputs,
    preparationInputs,
  } = req.body;



  let transaction;

  try {
    await sql.connect(config);

    transaction = new sql.Transaction();
    await transaction.begin();

    const request = new sql.Request(transaction);

    // Imprimir os valores antes de inserir na tabela Food

    console.log('req.body:', req.body);


    // Inserir dados na tabela Food
    await request.input('foodName', sql.NVarChar, foodName);
    await request.input('foodDetails', sql.NVarChar, foodDetails);
    await request.input('foodImg', sql.NVarChar, foodImg);

    const result = await request.query(
      `INSERT INTO Food (foodName, foodDetails, foodImg) OUTPUT INSERTED.id VALUES (@foodName, @foodDetails, @foodImg);`
    );

    if (!(result && result.recordset && result.recordset.length > 0)) {
      throw new Error('Nenhum registro encontrado na consulta.');
    }

    const foodId = result.recordset[0].id;

    // Inserir ingredientes na tabela Ingredients
    if (ingredientInputs) {
      for (let i = 0; i < ingredientInputs.length; i++) {
        await request.input(`ingredient${i}`, sql.NVarChar, ingredientInputs[i]);
        await request.query(
          `INSERT INTO Ingredients (ingredientName, foodId) VALUES (@ingredient${i}, ${foodId});`
        );
      }
    } else {
      console.error('Nenhum ingrediente fornecido.');
      // Lide com o erro ou retorne uma resposta apropriada.
    }


     // Inserir modo de preparo na tabela preparation
     if (preparationInputs) {
      for (let i = 0; i < preparationInputs.length; i++) {
        await request.input(`stepDescription${i}`, sql.NVarChar, preparationInputs[i]);
        await request.query(
          `INSERT INTO preparation (stepDescription, foodId) VALUES (@stepDescription${i}, ${foodId});`
        );
      }
    } else {
      console.error('Nenhum modo de preparo fornecido.');
      // Lide com o erro ou retorne uma resposta apropriada.
    }

      await transaction.commit();
      res.json({ message: 'Receita cadastrada com sucesso.' });
    } catch (err) {
      console.error('Erro:', err.message);
      if (transaction) {
        //await transaction.rollback();
      }
      res.status(500).json({ message: 'Erro ao cadastrar a receita.' });
    } finally {
      sql.close();
    }
});










// Rota de autenticação
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  sql.connect(config, (err) => {
    if (err) {
      console.error('Erro ao conectar ao banco de dados:', err);
      return res.status(500).json({ message: 'Erro ao conectar ao banco de dados.' });
    }

    const request = new sql.Request();

    request.query(`SELECT * FROM Usuarios WHERE username = '${username}' AND password = '${password}'`, (err, result) => {
      if (err) {
        console.error('Erro ao consultar o banco de dados:', err);
        sql.close();
        return res.status(500).json({ message: 'Erro ao consultar o banco de dados.' });
      }

      if (result.recordset.length === 1) {
        // Usuário autenticado com sucesso
        sql.close();
        return res.json({ message: 'Login bem-sucedido' });
      } else {
        // Usuário ou senha inválidos
        sql.close();
        return res.status(401).json({ message: 'Usuário ou senha inválidos.' });
      }
    });
  });
});



// Rota de cadastro
app.post('/api/cadastro-usuario', (req, res) => {
  const { username, password, email, nome_completo } = req.body;

  sql.connect(config, (err) => {
    if (err) {
      console.error('Erro ao conectar ao banco de dados:', err);
      return res.status(500).json({ message: 'Erro ao conectar ao banco de dados.' });
    }

    const request = new sql.Request();
    
    request.query(`INSERT INTO Usuarios (username, password, email, nome_completo) VALUES ('${username}', '${password}', '${email}', '${nome_completo}')`, (err, result) => {
      if (err) {
        console.error('Erro ao gravar no banco de dados:', err);
        sql.close();
        return res.status(500).json({ message: 'Erro ao gravar no banco de dados.' });
      }

      // Verifique se a inserção foi bem-sucedida
      if (result.rowsAffected.length > 0) {
        sql.close();
        return res.json({ message: 'Cadastro efetuado' });
      } else {
        sql.close();
        return res.status(401).json({ message: 'Erro 401.' });
      }
    });
  });
});



// Rota para buscar os dados da tabela Receita e relacionar com Ingredientes e Instrucoes
app.get('/api/pratos', (req, res) => {
  sql.connect(config, (err) => {
    if (err) {
      console.error('Erro ao conectar ao banco de dados:', err);
      return res.status(500).json({ message: 'Erro ao conectar ao banco de dados.' });
    }

    const request = new sql.Request();

    // Consulta SQL com JOIN para obter todos os dados
    const query = `
      SELECT
        R.ID AS Receita_ID,
        R.Nome_da_Receita,
        R.Descricao AS Descricao_Receita,
        I.ID AS Ingrediente_ID,
        I.Nome_do_Ingrediente,
        RI.Quantidade,
        I2.Ordem AS Instrucao_Ordem,
        I2.Descricao AS Instrucao_Descricao
      FROM
        Receitas R
      LEFT JOIN
        ReceitaIngredientes RI ON R.ID = RI.Receita_ID
      LEFT JOIN
        Ingredientes I ON RI.Ingrediente_ID = I.ID
      LEFT JOIN
        Instrucoes I2 ON R.ID = I2.Receita_ID
      ORDER BY
        R.ID, I.ID, I2.Ordem;
    `;

    request.query(query, (err, result) => {
      if (err) {
        console.error('Erro ao consultar o banco de dados:', err);
        sql.close();
        return res.status(500).json({ message: 'Erro ao consultar o banco de dados.' });
      }

      console.log(result.recordset); // Imprime os dados no console
      sql.close();

      return res.json(result.recordset);
    });
  });
});





// Iniciar o servidor na porta 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

