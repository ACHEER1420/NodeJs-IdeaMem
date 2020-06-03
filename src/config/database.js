require('dotenv').config();

if(process.env.NODE_ENV === 'production'){
  module.exports = process.env.db_dev
  
} else {
  module.exports = process.env.db_prod
}