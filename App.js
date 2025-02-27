const express = require('express');
const bodyParser = require('body-parser');
const { Sequelize, User, Post, Comment } = require('./models');

const app = express();
const port = 3000;

app.use(bodyParser.json());

const sequelize = new Sequelize('example_db', 'root', '', {
  host: 'localhost',
  dialect: 'mysql'
});

sequelize.sync();

app.get('/users/:id/posts', async (req, res) => {
  const user = await User.findByPk(req.params.id, {
      include: {
          model: Post,
          include: Comment
      }
  });
  res.json(user);
});

app.post('/users', async (req, res) => {
  const { name, email } = req.body;
  const user = await User.create({ name, email });
  res.json(user);
});

app.post('/posts', async (req, res) => {
  const { user_id, title, content } = req.body;
  const post = await Post.create({ user_id, title, content });
  res.json(post);
});

app.put('/posts/:id', async(req, res) => {
  const { title, content } = req.body;
  const post = await Post.update({ title, content }, {
    where: {id: req.params.id}
  });
  res.json(post);
});

app.delete('/posts/:id', async (req, res) => {
  const post = await Post.destroy({ where: { id: req.params.id } });
  res.json(post);
});

app.listen(port, () => {
  console.log(`Server běží na http://localhost:${port}`);
});
