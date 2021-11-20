const db = require('../db/conn')
const User = require('../models/User')


const bcrypt = require('bcryptjs')



module.exports = class AuthController{

    static login(req, res){

        res.render('auth/login')
    }

    static register(req, res){

        res.render('auth/register')
    } 
    
    static async registerPost(req, res){

        const { name, email, password, passwordConfirmation } = req.body

        
        //password match validdation//


        if(password != passwordConfirmation){
            req.flash('messages', 'As senhas não conferem, tente novamente!')
            res.render('auth/register')
            return
        }

        // check if user exists

        const checkIfUserExists = await User.findOne({where : {email : email}})

        if(checkIfUserExists){
            req.flash('messages', 'Email já cadastrado')
            res.render('auth/register')
            return
        }

        // create a password crypt

        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = bcrypt.hashSync(password, salt)

        const user = {
            name,
            email,
            password : hashedPassword,
        }
        try{
            const createdUser = await User.create(user)

            // initialize session 
            req.session.userid = createdUser.id

            req.flash('message', 'Cadastro realizado com sucesso!')

            req.session.save(()=>{
                res.redirect('/')
            })
        }catch(err){
            console.log(err)
        }
    }
}