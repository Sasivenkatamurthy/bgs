import React, { useEffect, useState } from 'react';
import { storage } from '../appwriteConfig';

const BUCKET_ID = '682797f8001be7c44a89';

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  gap: '16px',
  width: '100%',
};

const responsiveStyle = `
@media (max-width: 1200px) {
  .image-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
@media (max-width: 800px) {
  .image-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 500px) {
  .image-grid {
    grid-template-columns: 1fr;
  }
}
`;

const ImageGallery = () => {
  const [files, setFiles] = useState([]);

  const fetchImages = async () => {
    try {
      const res = await storage.listFiles(BUCKET_ID);
      setFiles(res.files);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <>
      <style>{responsiveStyle}</style>
      <div className="image-grid" style={gridStyle}>
        {files.length === 0 && <p>No images found or you do not have permission to view them.</p>}
        {files.map(file => (
          <img
            key={file.$id}
            src={storage.getFileView(BUCKET_ID, file.$id)}
            alt={file.name}
            style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: 8 }}
            onError={e => { e.target.style.display = 'none'; }}
          />
        ))}
      </div>
    </>
  );
};

export default ImageGallery;