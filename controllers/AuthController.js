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
            const data = {
                name,
                email
            }
            req.flash('messages', 'As senhas não conferem, tente novamente!')
            res.render('auth/register', {data : data})
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

            req.flash('messages', 'Cadastro realizado com sucesso!')

            req.session.save(()=>{
                res.redirect('/')
            })
        }catch(err){
            console.log(err)
        }
    }

    static logout(req, res){

        req.session.destroy()
        res.redirect('/login')
    }

    static async loginPost(req, res){

        const { email, password } = req.body

        const user = await User.findOne({ where : { email : email }})

        if(!user){

            req.flash('messages', 'Email incorreto!')
            res.render('auth/login')
            
            return 
        }

        const passwordMatch = bcrypt.compareSync(password, user.password)

        if(!passwordMatch){

            const data = {
                email
            }

            req.flash('messages', 'Senha incorreta!')
            res.render('auth/login', { data : data })
            return

        }

        // initialize session

        req.session.userid = user.id

        req.flash('messages', 'Login realizado com sucesso!')

        req.session.save(()=>{
            res.redirect('/')
        })

    }
}