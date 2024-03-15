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
  location: { lat: Number, lng: Number },
  images: [String], // 存储上传文件的路径
  confirmed: { type: Boolean, default: false },
});
const DataModel = mongoose.model('Data', DataSchema);

// 定义上传数据的路由
app.post('/upload', upload.array('images', 3), async (req, res) => {
  const { description, location } = req.body;
  const images = req.files.map(file => file.path); // 获取上传的文件路径

  const newData = new DataModel({
    description,
    location: JSON.parse(location), // 确保前端发送的location是字符串化的JSON
    images,
    confirmed: false, // 初始状态为未确认
  });

  try {
    await newData.save(); // 保存到数据库
    res.status(201).send('Data saved to MongoDB');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error saving data');
  }
}, (error, req, res, next) => { // 错误处理函数
  if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
    res.status(400).send('File size is too large. Maximum size is 10MB.');
  } else {
    res.status(500).send('Unexpected error occurred');
  }
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
