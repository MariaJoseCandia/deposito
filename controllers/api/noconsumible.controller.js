const express = require('express')
const router = express.Router()
const db = require('../../models')
const Noconsumible = db.NoConsumible
const { v4: uuidv4 } = require('uuid')
const auth = require('../../auth')

router.get('/noconsumibles', auth.isLoggedIn, async (req, res) => {

    await Noconsumible.findAll({
        attributes: ['idNoConsumible', 'codigo', 'nombre','detalle','IdUnidad','existenciaInicial','existenciaActual', 'createdAt', 'updatedAt']
    })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving No consumibles."
            });
        });
})

router.get('/noconsumibles/:id', auth.isLoggedIn, async (req, res) => {

    const id = req.params.id;

    await Noconsumible.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Roles with id=" + id
            });
        });
})

router.post('/noconsumibles', auth.isLoggedIn, async (req, res) => {

    // Validar el request (si no es vacio el nombre)
    if (!req.body.name) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    // Crear un no consumible
    const noconsumible = {
        id: uuidv4(),
        name: req.body.name,
        enabled: req.body.enabled,
        createAt: Date.now(),
        createdBy: '',
        updatedAt: Date.now(),
        updatedBy: ''
    };

    // Guardo el no consumible en la base de datos
    noconsumible.create(noconsumible)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the No consumibles."
            });
        });
})

router.put('/noconsumibles/:id', auth.isLoggedIn, async (req, res) => {
    const id = req.params.id;

    req.body.updatedAt = Date.now()

    //actualizo la informacion del objeto no consumible
    Noconsumible.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "No consumible was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update No consumible with id=${id}. Maybe Role was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Role with id=" + id
            });
        });
})

router.delete('/noconsumibles/:id', auth.isLoggedIn, async (req, res) => {

    const id = req.params.id;

    Noconsumible.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "No consumible was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Role with id=${id}. Maybe No consumible was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Role with id=" + id
            });
        });
})

module.exports = router