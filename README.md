# concrete challange

### Used technologies
- Nodejs
- Express
- Sequelize
## Routes
### Sign up
 - endpoint post(/signup) params => (nome,password,email,telefones:numero,ddd)

### Sign in
 - endpoint post(/signin) params => (password,email)

### Buscar usuário
 - endpoint get(/user/search/:id)

## Comandos Úteis:

### run migrations remotly on production
- npx sequelize-cli db:migrate --url <database_url>