require('./models/User');
require('./models/Track');
require('./models/ViewHistory');
require('./models/Likes');
require('./models/Review');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const trackRoutes = require('./routes/trackRoutes');
const accountRoutes = require('./routes/accountRoutes');
const pwdResetRoutes = require('./routes/pwdResetRoutes');
const historyRoutes = require('./routes/historyRoutes');
const imageRoutes = require('./routes/imageRoutes');
const requireAuth = require('./middlewares/requireAuth');



const app = express();

app.use(bodyParser.json());
app.use(authRoutes);
app.use(trackRoutes);
app.use(accountRoutes);
app.use(pwdResetRoutes);
app.use(historyRoutes);
app.use(imageRoutes);

const mongoUri = 'mongodb+srv://tatiana:tatiana0824@cluster0.cigjb.mongodb.net/UserInfo?retryWrites=true&w=majority';
if (!mongoUri) {
  throw new Error(
    `MongoURI was not supplied.  Make sure you watch the video on setting up Mongo DB!`
  );
}
mongoose.connect(mongoUri, {
  useNewUrlParser: true, 
  useCreateIndex: true
});
mongoose.connection.on('connected', () => {
  console.log('Connected to mongo instance');
});
mongoose.connection.on('error', err => {
  console.error('Error connecting to mongo', err);
});


app.get('/', requireAuth, (req, res) => {
  res.send(`Your email: ${req.user.email}`);
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Listening on port 3000');
});
