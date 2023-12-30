const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express();

const PORT = process.env.PORT || 3000;

// Conectar ao banco de dados MongoDB
const MONGODB_URI = 'mongodb+srv://steve:steve@cluster0.c0ygyxk.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });


// Configurar express-session
app.use(session({
  secret: 'seuSegredo', // Troque por uma string mais segura em produção
  resave: false,
  saveUninitialized: true,
}));

// Middleware de autenticação
const autenticacaoMiddleware = (req, res, next) => {
  if (!req.session.usuario) {
    return res.redirect('/login.html');
  }
  next();
};

// Aplicar middleware de autenticação a rotas relevantes
app.use(['/index.html', '/lista.html', '/problema.html'], autenticacaoMiddleware);

// Middleware de autenticação para dashboard
const autenticacaoMiddlewareDashboard = (req, res, next) => {
  if (!req.session.usuario) {
    return res.redirect('/login.html');
  }

  // Adicione a verificação para o usuário "SecTI"
  if (req.session.usuario !== 'SecTI') {
    return res.status(403).send('Acesso não autorizado.');
  }

  next();
};

// Aplicar middleware de autenticação a rota dashboard
app.use(['/dashboard.html', '/detalhesSecao.html'], autenticacaoMiddlewareDashboard);




// Definir o modelo do texto
const TextoSchema = new mongoose.Schema({
  usuario: String, // Adicione esta linha
  section: String,
  problem: String,
  conteudo: String,
  status: { type: String, enum: ['Na Fila', 'Em Processo', 'Finalizado'], default: 'Na Fila' },
});

const Texto = mongoose.model('Texto', TextoSchema, 'textos');




// Middleware para análise de corpo JSON
app.use(bodyParser.json());

// Rota para enviar texto
app.post('/netlify/functions/server/api/enviar', async (req, res) => {
  try {
    const { section, problem, texto } = req.body;
    const usuario = req.session.usuario; // Adicione esta linha para obter o usuário da sessão

    // Salvar todas as informações no banco de dados associadas ao usuário
    await Texto.create({ usuario, section, problem, conteudo: texto });

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.json({ success: false });
  }
});



// Rota para obter textos
app.get('/netlify/functions/server/api/obterTextos', async (req, res) => {
  try {
    const usuario = req.session.usuario; // Adicione esta linha para obter o usuário da sessão

    // Obter todos os textos do usuário do banco de dados
    const textos = await Texto.find({ usuario }).sort({ _id: -1 });

    res.json(textos);
  } catch (error) {
    console.error(error);
    res.json([]);
  }
});



// Rota para obter o último texto enviado
app.get('/netlify/functions/server/api/obterUltimoTexto', async (req, res) => {
  try {
    // Obter o último texto do banco de dados
    const ultimoTexto = await Texto.findOne().sort({ _id: -1 }).limit(1);

    res.json({ conteudo: ultimoTexto ? ultimoTexto.conteudo : '' });
  } catch (error) {
    console.error(error);
    res.json({ conteudo: '' });
  }
});

// Rota para obter todos os textos
app.get('/netlify/functions/server/api/obterTextos', async (req, res) => {
  try {
    // Obter todos os textos do banco de dados
    const textos = await Texto.find().sort({ _id: -1 });

    res.json(textos);
  } catch (error) {
    console.error(error);
    res.json([]);
  }
});

// Rota para obter detalhes de um texto por ID
app.get('/netlify/functions/server/api/obterDetalhesPorId/:id', async (req, res) => {
  try {
    const textoId = req.params.id;

    // Obter os detalhes do texto pelo ID
    const detalhesTexto = await Texto.findById(textoId);

    res.json(detalhesTexto);
  } catch (error) {
    console.error(error);
    res.json({});
  }
});

const Usuario = mongoose.model('Usuario', {
  usuario: String,
  senha: String,
}, 'users');


// Rota para cadastrar usuário
app.post('/netlify/functions/server/api/cadastrarUsuario', async (req, res) => {
  try {
    const { usuario, senha } = req.body;

    // Verificar se o usuário já existe
    const usuarioExistente = await Usuario.findOne({ usuario });

    if (usuarioExistente) {
      res.json({ success: false, message: 'Usuário já existe.' });
    } else {
      // Criar novo usuário
      await Usuario.create({ usuario, senha });
      res.json({ success: true });
    }
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: 'Erro ao cadastrar usuário.' });
  }
});

// Rota para realizar o login
app.post('/netlify/functions/api/login', async (req, res) => {
  try {
    const { usuario, senha } = req.body;

    // Verificar se o usuário existe
    const usuarioExistente = await Usuario.findOne({ usuario, senha });

    if (usuarioExistente) {
      // Criar a sessão para o usuário autenticado
      req.session.usuario = usuario;
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  } catch (error) {
    console.error(error);
    res.json({ success: false });
  }
});


// Rota para realizar o logout
app.post('/netlify/functions/server/api/logout', (req, res) => {
  // Limpar a sessão do usuário
  req.session.usuario = undefined;
  res.json({ success: true });
});


// Rota para verificar autenticação
app.get('/netlify/functions/server/api/verificarAutenticacao', (req, res) => {
  const autenticado = req.session.usuario ? true : false;
  res.json({ autenticado });
});

// Adicione a nova rota para obter seções
app.get('/netlify/functions/server/api/obterSecoes', async (req, res) => {
  try {
    // Obter todas as seções de todos os usuários do banco de dados
    const secoes = await Texto.distinct('section');

    res.json(secoes);
  } catch (error) {
    console.error(error);
    res.json([]);
  }
});

// Adicione a nova rota para obter detalhes de uma seção
app.get('/netlify/functions/server/api/obterDetalhesSecao/:secao', async (req, res) => {
  try {
    const { secao } = req.params;

    // Obter detalhes de todos os textos da seção do banco de dados
    const detalhesSecao = await Texto.find({ section: secao });

    res.json(detalhesSecao);
  } catch (error) {
    console.error(error);
    res.json([]);
  }
});

// Adicione a nova rota para obter o status de uma seção
app.get('/netlify/functions/server/api/obterStatusSecao/:secao', async (req, res) => {
  try {
    const { secao } = req.params;

    // Obter o status da seção do banco de dados
    const statusSecao = await Texto.findOne({ section: secao }).select('status');

    res.json({ status: statusSecao ? statusSecao.status : 'Na Fila' });
  } catch (error) {
    console.error(error);
    res.json({ status: 'Na Fila' });
  }
});


// Adicione a nova rota para atualizar o status de uma seção
app.post('/netlify/functions/server/api/atualizarStatusSecao', async (req, res) => {
  try {
    const { secao, novoStatus } = req.body;

    // Atualize o status da seção no banco de dados
    await Texto.updateMany({ section: secao }, { $set: { status: novoStatus } });

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.json({ success: false });
  }
});

// Defina o diretório onde suas imagens estão localizadas
app.use(express.static('./public/images/'));




// Servir arquivos estáticos
app.use(express.static('app/public'));

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor iniciado na porta ${PORT}`);
});
