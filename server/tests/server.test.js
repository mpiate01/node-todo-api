const expect = require('expect')
const request = require('supertest')
const {ObjectID} = require('mongodb') 

const {app} = require('./../server')
const {Todo} = require('./../models/todo')
const {User} = require('./../models/user')

const {todos,users, populateTodos, populateUsers} = require('./seed/seed')


beforeEach(populateUsers)
beforeEach(populateTodos)

describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        const text = 'Test todo text'
        
        request(app)
            .post('/todos')
            .set('x-auth', users[0].tokens[0].token)
            .send({text})
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text)
            })
            .end((err, res) => {
                if(err) {
                    return done(err)
                }

                Todo.find({text}).then((todos) => {
                    expect(todos.length).toBe(1)
                    expect(todos[0].text).toBe(text)
                    done()
                }).catch((e) => done(e))
            })
    })
    it('should not create todo with invalid body data', (done) => {
        request(app)
            .post('/todos')
            .set('x-auth', users[0].tokens[0].token)
            .send({})
            .expect(400)
            .end((err, res) => {
                if(err) {
                    return done(err)
                }

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2)
                    done()
                }).catch((e)=> done(e))
            })
    })
})


describe('GET /todos', () => {
    it('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(1)
            })
            .end(done)

    })

   
})

describe('GET /todos/:id', () => {
    it('should return todo doc', (done) => {
        request(app)    //toHexString() trasforma l'object ID in una string
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res)=> {
                expect(res.body.todo.text).toBe(todos[0].text)
            })
            .end(done)
    })
    it('should not return todo doc created by other user', (done) => {
        request(app)    //toHexString() trasforma l'object ID in una string
            .get(`/todos/${todos[1]._id.toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done)
    })

    it('should return 404 if todo not found', (done) => {
        const not_saved_id = new ObjectID().toHexString()
        request(app)
            .get(`/todos/${not_saved_id}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done)
    })

    it('should return 404 for not object ID', (done) => {
        request(app)
            .get(`/todos/123`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done)
    })    
})

describe('DELETE /todos/:id', () => {
    it('should delete a todo', (done) => {
        const hexId = todos[1]._id.toHexString()    //from variable at the very top
        
        request(app)
            .delete(`/todos/${hexId}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(hexId)
            })
            .end((err,resp) => {
                if(err) {
                    return done(err)
                }

                Todo.findById(hexId).then((todo)=>{
                    expect(todo).toNotExist()
                    done()
                }).catch((e)=> done(e))
            })
    })
    it('should not delete a todo', (done) => {
        const hexId = todos[0]._id.toHexString()    //from variable at the very top
        
        request(app)
            .delete(`/todos/${hexId}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(404)
            .end((err,resp) => {
                if(err) {
                    return done(err)
                }

                Todo.findById(hexId).then((todo)=>{
                    expect(todo).toExist()
                    done()
                }).catch((e)=> done(e))
            })
    })    
    it('should return a 404 if todo not found', (done) => {
        const not_saved_id = new ObjectID().toHexString()
        request(app)
            .delete(`/todos/${not_saved_id}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(404)
            .end(done)        
    })   
    it('should return a 404 if objectid is invalid', (done) => {
        request(app)
        .delete(`/todos/123`)
        .set('x-auth', users[1].tokens[0].token)
        .expect(404)
        .end(done)       
    })     
})

describe('PATCH /todos/:id', () => {
    it('should update the todo', (done) => {
        const hexId = todos[0]._id.toHexString()
        const text = 'Test'
        request(app)
            .patch(`/todos/${hexId}`)
            .send({
                    text,
                    completed: true
            })
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res)=>{
                    expect(res.body.todo.text).toBe(text)
                    expect(res.body.todo.completed).toBe(true)
                    expect(res.body.todo.completedAt).toBeA('number')
            })
            .end(done)

    })
    it('should not update the todo because wrong user', (done) => {
        const hexId = todos[0]._id.toHexString()
        const text = 'Test'
        request(app)
            .patch(`/todos/${hexId}`)
            .send({
                    text,
                    completed: true
            })
            .set('x-auth', users[1].tokens[0].token)
            .expect(404)
            .end(done)

    })    

    it('should clear completedAt when to do is not completed', (done) => {
        const hexId = todos[1]._id.toHexString()
        request(app)
            .patch(`/todos/${hexId}`)
            .send({
                    completed: false
            })
            .expect(200)
            .set('x-auth', users[1].tokens[0].token)
            .expect((res)=>{
                    expect(res.body.todo.completed).toBe(false)
                    expect(res.body.todo.completedAt).toBe(null)
            })
            .end(done)      
    })

})


describe('GET /users/me', ()=> {
    it('should return user if authenticated', (done)=>{
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res)=>{
                expect(res.body._id).toBe(users[0]._id.toHexString())
                expect(res.body.email).toBe(users[0].email)
            })
            .end(done)
    })
    it('should return 401 if not authenticated', (done)=>{
        request(app)
            .get('/users/me')
            .set('x-auth', '')
            .expect(401)
            .expect((res)=>{
                expect(res.body).toEqual({})
            })
            .end(done)        
    })    
})

describe('POST /users', ()=> {
    it('should create a user', (done) => {
        const email = 'ci2ao@libero.it'
        const password = '123456'
        request(app)
            .post('/users')
            .send({email, password})
            .expect(200)
            .expect((res) => {
                expect(res.header['x-auth']).toExist()
                expect(res.body.user._id).toExist()
                expect(res.body.user.email).toBe(email)
            })
            .end((err) => {
                if(err){
                    return done(err)
                }
                User.findOne({email}).then((user) => {
                    expect(user).toExist()
                    expect(user.password).toNotBe(password)
                    done()
                }).catch((e) => done(e))
            })
    })
    it('should return validation errors if request invalid', (done)=>{        
        const email = 'ci2aolibero'
        const password = '123456' 
        request(app)
            .post('/users')
            .send({email, password})
            .expect(400)
            .end(done)
    })
    it('should not create user if email in use', (done)=>{
        const email = users[0].email
        const password = users[0].password 
        request(app)
            .post('/users')
            .send({email, password})
            .expect(400)
            .end(done)             
    })

})

describe('POST /users/login', ()=> {
    it('should login user and return auth token', (done)=>{
        request(app)
            .post('/users/login')
            .send({
                email : users[1].email, 
                password: users[1].password
            })
            .expect(200)
            .expect((res) => {
                expect(res.header['x-auth']).toExist()
            })
            //perche' controlliamo il db con una query, nn abbiamo un semplice end
            .end((err, res) => {
                if(err) {
                    return done(err)
                }
                User.findById(users[1]._id).then((user) => {
                    expect(user.tokens[1]).toInclude({
                        access: 'auth',
                        token: res.headers['x-auth']
                    })
                    done()
                }).catch((e) => done(e))
            })
    })

    it('should reject invalid login', (done)=>{
        request(app)
        .post('/users/login')
        .send({
            email : users[1].email, 
            password: '123'
        })
        .expect(400)
        .expect((res) => {
            expect(res.header['x-auth']).toNotExist()
        })
        //perche' controlliamo il db con una query, nn abbiamo un semplice end
        .end((err, res) => {
            if(err) {
                return done(err)
            }
            User.findById(users[1]._id).then((user) => {
                expect(user.tokens.length).toBe(1)
                done()
            }).catch((e) => done(e))
        })    
    })
})


describe('DELETE /users/me/token', ()=> {
    it('should remove auth token on logout', (done)=>{
        //DELETE /users/me/token
        //set x-auth equal token
        //200 - end call to check db token 0 length
        request(app)
            .delete('/users/me/token')
            .set('x-auth', users[0].tokens[0].token )
            .expect(200)
            .end((err, res) => {
                if(err) {
                    return done(err)
                }
                User.findById(users[0]._id).then((user) => {
                    expect(user.tokens.length).toBe(0)
                    done()
                }).catch((e) => done(e))
            }) 
    })
})