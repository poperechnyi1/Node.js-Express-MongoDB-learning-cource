const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const app = require('./app');
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(
    DB,
    // mongoose.connect(process.env.DATABASE_LOCAL,
    {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
    }
  )
  .then(() => {
    console.log('DB connections successful!');
  });

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App runing on port ${port}...`);
});

process.on('unhandledRejection', err => {
  console.log(err.name, err.message)
  console.log('UNHANDLED REJECTION Shutting down..')
  server.close(()=>{
    process.exit(1)
  })
})
