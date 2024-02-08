import React from 'react';
import UploadForm from './UploadForm'; // 假设UploadForm组件保存在同一目录下

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h2>图片上传</h2>
      </header>
      <main>
        <UploadForm />
      </main>
    </div>
  );
}

export default App;
