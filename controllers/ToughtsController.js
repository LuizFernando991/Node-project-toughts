const Tought = require('../models/Tought')


module.exports = class ToughtsController{

    static async showToughts(req, res){

        const data = await Tought.findAll({raw : true})

        res.render('toughts/home', {data : data})
    }


    static async dashboard(req, res){

        res.render('toughts/dashboard')
    }

    static createTought(req, res){

        res.render('toughts/create')
    }

    static async createToughtPost(req, res){

        const data = {
            title : req.body.title,
            UserId : req.session.userid
        }

        await Tought.create(data)

        req.flash('messages', 'Pensamento criado!')

        req.session.save(()=>{
            res.redirect('/dashboard')
        })

    }
}