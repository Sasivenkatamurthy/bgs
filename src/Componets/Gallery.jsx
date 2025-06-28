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
            <div style={{
                marginTop: 0,
                color: '#2e7d32',
                fontWeight: 700,
                width: '100vw',
                maxWidth: '100vw',
                padding: 0,
                marginBottom: 190
            }}>
                <div
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 16,
                        justifyContent: 'center',
                        width: '100vw',
                        maxHeight: '60vh',
                        overflowY: 'auto',
                        boxSizing: 'border-box',
                        padding: '0 2vw'
                    }}
                >
                    {images.length > 0 ? (
                        images.map((img, idx) => (
                            <div
                                key={idx}
                                style={{
                                    position: 'relative',
                                    width: '200px',
                                    height: '600px',
                                    flex: '0 0 calc(25% - 16px)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                                onMouseEnter={() => setHoveredIdx(idx)}
                                onMouseLeave={() => setHoveredIdx(null)}
                            >
                                <img
                                    src={img}
                                    alt="User upload"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        borderRadius: 8,
                                        marginBottom: 10,
                                        maxWidth: '100%',
                                        minWidth: 0
                                    }}
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