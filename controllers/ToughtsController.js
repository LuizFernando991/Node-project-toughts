const Tought = require('../models/Tought')


module.exports = class ToughtsController{

    static async showToughts(req, res){

        const data = await Tought.findAll({raw : true})

        res.render('toughts/home', {data : data})
    }



}