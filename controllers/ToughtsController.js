const Tought = require('../models/Tought')
const User = require('../models/User')


module.exports = class ToughtsController{

    static async showToughts(req, res){

        const data = await Tought.findAll({raw : true})

        res.render('toughts/home', {data : data})
    }


    static async dashboard(req, res){
        
        const userId = req.session.userid

        const user = await User.findOne({where : { id : userId }, include: Tought, plain: true})

        const toughts = user.Toughts.map(result=>{
            return result.dataValues
        })

        if(!user){
            res.redirect('/login')
        }

        res.render('toughts/dashboard', { toughts : toughts })
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

    static async deleteTought(req, res){

        const id = req.body.id

        await Tought.destroy({where : { id : id, UserId : req.session.userid}})

        req.flash('messages', 'Pensamento removido!')

        req.session.save(()=>{
            res.redirect('/dashboard')
        })
    }
}