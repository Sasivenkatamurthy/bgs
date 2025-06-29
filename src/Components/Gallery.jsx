import React, { useEffect, useState } from 'react';
import { DownloadSimple } from "@phosphor-icons/react";

function Gallery() {
    const [images, setImages] = useState([]);
    const [hoveredIdx, setHoveredIdx] = useState(null);
    const [dimensions, setDimensions] = useState({});

    useEffect(() => {
        fetch(`${process.env.REACT_APP_BGSBackend_URI}/api/user-images`)
            .then(res => res.json())
            .then(data => setImages(data.images || []));
    }, []);

    const handleImageLoad = (idx, e) => {
        const { naturalWidth, naturalHeight } = e.target;
        setDimensions(dim => ({
            ...dim,
            [idx]: { width: naturalWidth, height: naturalHeight }
        }));
    };

    return (
        <div className="gallery-root">
            <div className="gallery-grid">
                {images.length > 0 ? (
                    images.map((img, idx) => {
                        const dim = dimensions[idx];
                        // Set style based on original image size, but limit max size for layout
                        const itemStyle = dim
                            ? {
                                width: Math.min(dim.width, 700), 
                                height: Math.min(dim.height, 500),
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'relative',
                                background: '#fff',
                                borderRadius: 10,
                                boxShadow: '0 2px 12px #0001',
                                overflow: 'hidden',
                            }
                            : {};
                        return (
                            <div
                                key={idx}
                                className="gallery-item"
                                style={itemStyle}
                                onMouseEnter={() => setHoveredIdx(idx)}
                                onMouseLeave={() => setHoveredIdx(null)}
                            >
                                <img
                                    src={img}
                                    alt="User upload"
                                    className="gallery-img"
                                    onLoad={e => handleImageLoad(idx, e)}
                                    style={dim ? {
                                        width: dim.width > 700 ? 700 : dim.width,
                                        height: dim.height > 500 ? 500 : dim.height,
                                        maxWidth: '100%',
                                        maxHeight: '100%',
                                        objectFit: 'contain',
                                        borderRadius: 10,
                                        background: '#f3f3f3',
                                        transition: 'transform 0.2s'
                                    } : {}}
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
                        );
                    })
                ) : (
                    <div>No images uploaded yet.</div>
                )}
            </div>
            <style>
                {`
            .gallery-root {
                min-height: 100vh;
                width: 100vw;
                background: linear-gradient(135deg, #f8fafc 0%, #e3ecf7 100%);
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0;
            }
            .gallery-grid {
                display: flex;
                flex-wrap: wrap;
                gap: 20px;
                width: 90vw;
                max-width: 1400px;
                margin: 40px auto;
                justify-content: flex-start;
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
                .gallery-grid {
                    gap: 14px;
                }
            }
            @media (max-width: 600px) {
                .gallery-grid {
                    gap: 8px;
                }
            }
            `}
            </style>
        </div>
    );
}

export default Gallery;