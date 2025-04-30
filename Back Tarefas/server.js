import express from 'express';
import mysql from 'mysql2';
import dotenv from 'dotenv';
import cors from 'cors';
import isEqual from 'lodash.isequal';

// Carregar variáveis de ambiente do arquivo .env
dotenv.config();

const app = express();
const port = 3000;

app.use(cors({
    origin: '*', // Permitir requisições de qualquer origem (ajuste conforme necessário)
    methods: ['GET', 'POST','PUT', 'PATCH' ,'DELETE'], // Métodos permitidos
    allowedHeaders: ['Content-Type'], // Cabeçalhos permitidos
}));

// Conexão com o banco de dados
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// Conectar ao MySQL
db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Conectado ao MySQL!');
});

// Middleware para aceitar JSON
app.use(express.json());

app.get('/tarefas', (req, res) => {
    db.query('SELECT * FROM tarefas', (err, results) => {
        if (err) {
            console.error('Erro ao buscar tarefas:', err);
            res.status(500).send('Erro ao buscar tarefas');
            return "Erro ao buscar tarefas";
        }
        res.json(results);
    });
});

app.post('/tarefas', (req, res) => {
    db.query('INSERT INTO tarefas (id, nome , descricao, periodicidade, dataInicio ,dataPrevisao ,status ,comentarios) VALUES (?, ? , ? , ? , ? , ? , ? , ?)', [req.body.id, req.body.nome , req.body.descricao , req.body.periodicidade , req.body.dataInicio , req.body.dataPrevisao , req.body.status , req.body.comentarios], (err, results) => {
        if (err) {
            console.error('Erro ao adicionar tarefa:', err);
            res.status(500).send('Erro ao adicionar tarefa');
            return "Erro ao adicionar tarefa";
        }
        console.log("Sucesso ao adicionar tarefa:", req.body.id);
        res.status(201).json({ id: results.insertId, ...req.body });

    });
});


app.put('/tarefas/:id', (req, res) => {
    const { id } = req.params;
    const novosDados = req.body;
    
    // Buscar a tarefa existente
    db.query('SELECT id,nome,descricao,periodicidade,dataInicio,dataPrevisao,status,comentarios FROM tarefas WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('Erro ao buscar tarefa existente:', err);
            return res.status(500).send('Erro ao buscar tarefa existente');
        }

        const tarefaExistente = results[0];
        tarefaExistente.dataInicio = tarefaExistente.dataInicio.toISOString(); 
        tarefaExistente.dataPrevisao = tarefaExistente.dataPrevisao.toISOString(); 

        
        if (!tarefaExistente) {
            return res.status(404).send('Tarefa não encontrada');
        }

        // Verifica se os dados são iguais
        if (isEqual(novosDados, tarefaExistente)) {
            console.log("Dados iguais, não é necessário atualizar.");
            return res.status(304).send('Dados iguais, não é necessário atualizar.');
        }

        // Atualizar diretamente
        db.query(
            'UPDATE tarefas SET nome = ?, descricao = ?, periodicidade = ?, dataInicio = ?, dataPrevisao = ? , comentarios = ? WHERE id = ?',
            [
                novosDados.nome,
                novosDados.descricao,
                novosDados.periodicidade,
                novosDados.dataInicio,
                novosDados.dataPrevisao,
                novosDados.comentarios,
                id
            ],
            (updateErr) => {
                if (updateErr) {
                    console.error('Erro ao atualizar tarefa:', updateErr);
                    return res.status(500).send('Erro ao atualizar tarefa');
                }

                console.log("Tarefa atualizada com sucesso:", id);
                return res.status(200).json({ id, ...novosDados });
            }
        );
    });
});


app.delete('/tarefas/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM tarefas WHERE id = ?', [id], (err) => {
        if (err) {
            console.error('Erro ao deletar tarefa:', err);
            res.status(500).send('Erro ao deletar tarefa');
            return "Erro ao deletar tarefa";
        }
        console.log("Sucesso ao deletar tarefa:", id);
        res.sendStatus(204); // No Content
    });
});

app.patch('/tarefas/:id', (req, res) => {
    console.log("Atualizando status da tarefa com ID:", req.params.id , req.body.status);
    const { id } = req.params;
    db.query('UPDATE tarefas SET status = ? WHERE id = ?', [req.body.status, id], (err) => {
        if (err) {
            console.error('Erro ao atualizar status da tarefa:', err);
            res.status(500).send('Erro ao atualizar status da tarefa');
            return "Erro ao atualizar status da tarefa";
        }
        console.log("Sucesso ao atualizar status da tarefa:", id);
        res.sendStatus(204); // No Content
    });
})

app.get('/notas', (req, res) => {
    db.query('SELECT * FROM observacoes', (err, results) => {
        if (err) {
            console.error('Erro ao buscar notas:', err);
            res.status(500).send('Erro ao buscar notas');
            return "Erro ao buscar notas";
        }
        res.json(results).status(200);
    });
});

app.post('/notas', (req, res) => {
    db.query('INSERT INTO observacoes (texto) VALUES (?)', [req.body.texto], (err, results) => {
        if (err) {
            console.error('Erro ao adicionar nota:', err);
            res.status(500).send('Erro ao adicionar nota');
            return "Erro ao adicionar nota";
        }
        console.log("Sucesso ao adicionar nota:", req.body.id);
        res.json({ id: results.insertId, ...req.body }).status(201);
    })
});

app.delete('/notas/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM observacoes WHERE id = ?', [id], (err) => {
        if (err) {
            console.error('Erro ao deletar nota:', err);
            res.status(500).send('Erro ao deletar nota');
            return "Erro ao deletar nota";
        }
        res.sendStatus(204); // No Content
    });
}) 

// Startar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});


function buscaTarefas(id, callback) {
    db.query('SELECT * FROM tarefas WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('Erro ao buscar tarefas:', err);
            return callback(err, null);
        }

        callback(null, results);
    });
}
