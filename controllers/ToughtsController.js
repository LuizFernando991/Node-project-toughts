const Tought = require('../models/Tought')
const User = require('../models/User')

const { Op } = require('sequelize')


module.exports = class ToughtsController{

    static async showToughts(req, res){

        let search = ''
        let order = 'DESC'

        if(req.query.order === 'old'){
            let order = 'ASC'
        }else{
            order = 'DESC'
        }

        if(req.query.search){
            search = req.query.search
        }

        const data = await Tought.findAll({include: User, where : {
            title: {[Op.like]: `%${search}%`}
        },
        order: [['createAt', order]]
    })

        
        const tought = data.map(result => result.get({plain: true}))
        
        let toughtsQty = tought.length

        if(toughtsQty === 0){
            toughtsQty = false
        }
//
        
        res.render('toughts/home', {tought : tought, search : search, toughtsQty : toughtsQty})
    }


    static async dashboard(req, res){
        
        const userId = req.session.userid

        const user = await User.findOne({where : { id : userId }, include: Tought, plain: true})

        const toughts = user.Toughts.map(result=>{
            return result.dataValues
        })

        let empty = false
        
        if(toughts.length === 0){
            empty = true
        }

        if(!user){
            res.redirect('/login')
        }

        res.render('toughts/dashboard', { toughts : toughts, empty })
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

    static async editTought(req, res){

        const id = req.params.id

        const tought = await Tought.findOne({raw : true ,where : { id : id }})

        res.render('toughts/edit', { tought : tought})


    }

    static async editToughtPost(req, res){

        const id = req.body.id

        const data = {
            title : req.body.title
        }

        await Tought.update(data, {where: { id : id}})

        req.flash('messages', 'Pensamento atualizado!')

        req.session.save(()=>{
            res.redirect('/dashboard')
        })

    }
}