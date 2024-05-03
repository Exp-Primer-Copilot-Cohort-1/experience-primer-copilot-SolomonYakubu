//create web server
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const comments = require('./comments.json');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

//get all comments
app.get('/comments', (req, res) => {
    res.json(comments);
});

//get comment by id
app.get('/comments/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const comment = comments.find(comment => comment.id === id);
    if (comment) {
        res.json(comment);
    } else {
        res.status(404).send('Comment not found');
    }
});

//add new comment
app.post('/comments', (req, res) => {
    const comment = req.body;
    const id = comments.length + 1;
    comment.id = id;
    comments.push(comment);
    fs.writeFile('comments.json', JSON.stringify(comments), 'utf8', (err) => {
        if (err) {
            res.status(500).send('Error saving comment');
        } else {
            res.json(comment);
        }
    });
});

//update comment
app.put('/comments/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const newComment = req.body;
    const oldComment = comments.find(comment => comment.id === id);
    if (oldComment) {
        const index = comments.indexOf(oldComment);
        comments[index] = newComment;
        fs.writeFile('comments.json', JSON.stringify(comments), 'utf8', (err) => {
            if (err) {
                res.status(500).send('Error saving comment');
            } else {
                res.json(newComment);
            }
        });
    } else {
        res.status(404).send('Comment not found');
    }
});

//delete comment
app.delete('/comments/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const comment = comments.find(comment => comment.id === id);
    if (comment) {
        const index = comments.indexOf(comment);
        comments.splice(index, 1);
        fs.writeFile('comments.json', JSON.stringify(comments), 'utf8', (err) => {
            if (err) {
                res.status(500).send('Error deleting comment');
            } else {
                res.json(comment);
            }
        }   ); 
    }
    else {
        res.status(404).send('Comment not found');
    }
}
);