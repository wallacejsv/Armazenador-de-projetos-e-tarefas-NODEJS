const express = require('express');
const server = express();

server.use(express.json());

let numberOfRequests = 0;
const projects = [];

function logRequests(res, req, next) {
  numberOfRequests++;

  console.log(`Numero de requisições: ${numberOfRequests}`);

  return next();
}

server.use(logRequests);

function checkProjectExists(req, res, next) {
  const { id } = req.params;

  const project = projects.find(p => p.id === id);

  if(!project) return res.status(400).json({ error: `Não existe o projeto` });

  return next();
}

server.post('/projects', (req, res) => {
  const { id, title, tasks } = req.body;

  const project = {
    id,
    title,
    tasks: []
  };

  projects.push(project);

  return res.json(project);
});

server.get('/projects', (req, res) => {
  return res.json(projects);
});

server.put('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id === id);
  console.log(project);

  project.title = title;

  return res.json(project);
});

server.delete('/projects/:id', checkProjectExists, (req,res) => {
  const { id } = req.params;

  const project = projects.findIndex(p => p.id === id);

  projects.splice(project, 1);

  return res.send();
});

server.post('/projects/:id/tasks', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id === id);

  project.tasks.push(title);

  return res.json(project);
});

server.listen(4000);