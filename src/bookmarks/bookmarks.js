const express = require('express');
const uuid = require('uuid/v4');
const logger = require('../logger');
const bookRouter = express.Router();
const bodyParser = express.json();

const books = [
  {
    id: 1,
    title: 'Harry Potter',
    content: 'book 1'
  }
];

bookRouter
  .route('/book')
  .get((req, res) => {
    res.json(books);
  })
  .post(bodyParser, (req, res) => {
    const { title, content } = req.body;

    if (!title) {
      logger.error(`Title is required`);
      return res.status(400).send('Invalid data');
    }

    if (!content) {
      logger.error(`Content is required`);
      return res.status(400).send('Invalid data');
    }

    const id = uuid();

    const book = {
      id,
      title,
      content
    };

    books.push(book);

    logger.info(`Book with id ${id} created`);
    res
      .status(201)
      .location(`http://localhost:1000/book/${id}`)
      .json(book);
  });

bookRouter
  .route('/book/:id')
  .get((req, res) => {
    const { id } = req.params;
    const book = books.find(b => b.id == id);

    if (!book) {
      logger.error(`Book with id ${id} not found.`);
      return res.status(404).send('Not found');
    }
    res.json(book);
  })
  .delete((req, res) => {
    const { id } = req.params;
    const bookIndex = books.findIndex(b => b.id == id);

    if (bookIndex === -1) {
      logger.error(`book with id ${id} not found`);
      return status(404).send('Not found');
    }
    books.splice(id, 1);
    logger.info(`Bookmark with id ${id} deleted.`);
    res.status(204).end();
  });

module.exports = bookRouter;
