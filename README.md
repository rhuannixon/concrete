# concrete
heroku_url = https://serene-taiga-90757.herokuapp.com
## Sign up
 - endpoint post(/user/signin) params => (nome,password,email,telefones:numero,ddd)

## Sign in
 - endpoint post(/user/signin) params => (password,email)

## Buscar usuário
 - endpoint get(/user/search/:id)

# Comandos Úteis:

## run migrations remotly on production
- npx sequelize-cli db:migrate --url <database_url>