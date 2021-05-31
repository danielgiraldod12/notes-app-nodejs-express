const express = require('express');
const router = express.Router();

const Note = require('../models/Note')
const { isAuthenticated } = require('../helpers/auth')

router.get('/notes/add', isAuthenticated, (req, res) => {
    res.render('notes/create-form')
})

router.post('/notes/new-note', isAuthenticated, async(req, res) => {
    const {title, description} = req.body;
    const errors = [];
    if(!title){
        errors.push({text: 'Por favor ingrese un titulo'})
    }
    if(!description){
        errors.push({text: 'Por favor ingrese una descripcion'})
    }
    if(errors.length > 0){
        res.render('notes/create-form', {
            errors,
            title,
            description
        }) 
    }else{
        const newNote = new Note({title, description});
        newNote.id_user = req.user.id;
        await newNote.save();
        req.flash('success_msg', 'Note created successfully!')
        res.redirect('/notes')
    }
})

router.get('/notes/', isAuthenticated, async(req, res) => {
    await Note.find({id_user: req.user.id}).sort({date: 'desc'})
    .then(documentos => {
      const contexto = {
          notes: documentos.map(documento => {
          return {
              _id: documento._id,
              title: documento.title,
              description: documento.description
          }
        })
      }
      res.render('notes/list', {
        notes: contexto.notes }) 
    })
})

router.get('/notes/edit/:id', isAuthenticated, async(req, res) => {
    const note = await Note.findById(req.params.id)
    .then(data =>{
        return {
            title:data.title,
            description:data.description,
            id:data.id
        }
    })
    res.render('notes/edit', {
        note
    })
})

router.put('/notes/update/:id', isAuthenticated, async(req,res) => {
    const {title, description} = req.body;
    await Note.findByIdAndUpdate(req.params.id, {title, description});
    req.flash('success_msg', 'Note edited successfully')
    res.redirect('/notes')
})

router.delete('/notes/delete/:id', isAuthenticated, async(req, res) => {
    await Note.findByIdAndDelete(req.params.id)
    req.flash('success_msg', 'Note deleted successfully')
    res.redirect('/notes')
})

module.exports = router;
