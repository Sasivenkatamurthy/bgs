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
        <div style={{
            minHeight: '100vh',
            width: '100vw',
            background: 'linear-gradient(135deg, #f8fafc 0%, #e3ecf7 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <style>
                {`
                .gallery-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 16px;
                    width: 90vw;
                    max-width: 1200px;
                    margin: 0 auto;
                }
                @media (max-width: 900px) {
                    .gallery-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }
                @media (max-width: 600px) {
                    .gallery-grid {
                        grid-template-columns: 1fr;
                    }
                }
                .gallery-item {
                    position: relative;
                    aspect-ratio: 2/3;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .gallery-img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    border-radius: 8px;
                }
                `}
            </style>
            <div style={{
                marginTop: 0,
                color: '#2e7d32',
                fontWeight: 700,
                width: '100vw',
                maxWidth: '100vw',
                padding: 0,
                marginBottom: 190
            }}>
                <div className="gallery-grid">
                    {images.length > 0 ? (
                        images.map((img, idx) => (
                            <div
                                key={idx}
                                className="gallery-item"
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
                                        style={{
                                            position: 'absolute',
                                            top: 10,
                                            right: 10,
                                            background: 'rgba(0,0,0,0.6)',
                                            borderRadius: '50%',
                                            padding: 6,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#fff',
                                            cursor: 'pointer',
                                            zIndex: 2,
                                            textDecoration: 'none'
                                        }}
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
            </div>
        </div>
    );
}

export default Gallery;