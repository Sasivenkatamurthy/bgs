import React, { useEffect, useState } from 'react';
import { DownloadSimple } from "@phosphor-icons/react";

function Gallery() {
  const [images, setImages] = useState([]);
  const [hoveredIdx, setHoveredIdx] = useState(null);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BGSBackend_URI}/api/user-images`)
      .then(res => res.json())
      .then(data => setImages(data.images || []));
  }, []);

  return (
    <div className="gallery-root">
      <div className="masonry-grid">
        {images.length > 0 ? (
          images.map((img, idx) => (
            <div
              key={idx}
              className="masonry-item"
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <img
                src={img}
                alt="User upload"
                className="gallery-img"
              />
              {hoveredIdx === idx && (
                <a
                  href={img}
                  download
                  className="download-btn"
                  title="Download"
                >
                  <DownloadSimple size={24} weight="bold" />
                </a>
              )}
            </div>
          ))
        ) : (
          <div>No images uploaded yet.</div>
        )}
      </div>

      <style>{`
        .gallery-root {
          min-height: 100vh;
          width: 100vw;
          background: #fafafa;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: 40px 0;
        }

        .masonry-grid {
          column-count: 3;
          column-gap: 20px;
          width: 90vw;
          max-width: 1400px;
        }

        .masonry-item {
          position: relative;
          margin-bottom: 20px;
          break-inside: avoid;
          background: #fff;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 2px 12px #0001;
        }

        .gallery-img {
          width: 100%;
          height: auto;
          display: block;
        }

        .masonry-item:hover .gallery-img {
          transform: scale(1.02);
          transition: transform 0.3s;
        }

        .download-btn {
          position: absolute;
          top: 10px;
          right: 10px;
          background: rgba(0,0,0,0.6);
          border-radius: 50%;
          padding: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          cursor: pointer;
          z-index: 2;
          text-decoration: none;
        }

        @media (max-width: 900px) {
          .masonry-grid {
            column-count: 2;
            column-gap: 16px;
          }
        }

        @media (max-width: 600px) {
          .masonry-grid {
            column-count: 1;
            column-gap: 0;
          }
        }
      `}</style>
    </div>
  );
}

export default Gallery;
