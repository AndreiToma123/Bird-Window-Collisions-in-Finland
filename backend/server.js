const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const cors = require('cors');
const path = require('path');

const app = express();
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function(req, file, cb) {
    // 生成文件名时保留原始扩展名
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// const upload = multer({ storage: storage });
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 设置最大文件大小为 10MB
});

// 使用bodyParser处理JSON数据和表单数据
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors()); // 允许跨域请求

app.use('/uploads', express.static('uploads'));
// 连接到MongoDB数据库
mongoose.connect('mongodb://localhost:27017/yourDatabaseName', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error(err));

// 定义一个简单的数据模型
const DataSchema = new mongoose.Schema({
  description: String,
  time: String,
  location: {
    lat: Number,
    lng: Number
  },
  images: [String],
  confirmed: { type: Boolean, default: false },
});


const DataModel = mongoose.model('Data', DataSchema);


app.post('/upload', upload.fields([
  { name: 'headImage', maxCount: 1 },
  { name: 'bodyImage', maxCount: 1 },
  { name: 'tailImage', maxCount: 1 }
]),  async (req, res) => {
  const { description, timestamp } = req.body;
  console.log(req.body)
  let location;
  try {
    location = JSON.parse(req.body.location);
  } catch (e) {
    return res.status(400).send('Invalid location format');
  }

  const images = [];
  if(req.files['headImage']) images.push(req.files['headImage'][0].path);
  if(req.files['bodyImage']) images.push(req.files['bodyImage'][0].path);
  if(req.files['tailImage']) images.push(req.files['tailImage'][0].path);

  const parsedLocation = JSON.parse(req.body.location);
  const locationCoordinates = parsedLocation.coordinates; // 直接使用 coordinates 对象

  const newData = new DataModel({
    description,
    time: timestamp,
    location: locationCoordinates, // 使用解构的方式直接传递 lat 和 lng
    images,
    confirmed: false,
  });

  try {
    await newData.save();
    res.status(201).send('Data saved to MongoDB');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error saving data');
  }
}, (error, req, res, next) => { // Multer 错误处理函数
  console.log(error)
  if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).send('File size is too large. Maximum size is 10MB.');
  } else if (error) {
    return res.status(500).send('Unexpected error occurred');
  }
  next();
});


app.get('/api/data/unconfirmed', async (req, res) => {
  try {
    const unconfirmedData = await DataModel.find({ confirmed: false });
    console.log(unconfirmedData); // 添加此行来查看数据
    res.json(unconfirmedData);
  } catch (error) {
    console.error(error); // 更详细的错误日志
    res.status(500).send(error.message);
  }
});

  app.post('/api/data/confirm', async (req, res) => {
    const { id, imagesToKeep } = req.body; // 假设发送了数据项的ID和要保留的图片数组
  
    try {
      const updatedData = await DataModel.findByIdAndUpdate(id, {
        confirmed: true,
        images: imagesToKeep,
      }, { new: true });
  
      res.json(updatedData);
    } catch (error) {
      res.status(500).send(error.message);
    }
  });
  
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});