import React, { useState, useEffect } from 'react';

function Toast({ message, show, onClose }) {
    useEffect(() => {
        if (show) {
            const timer = setTimeout(() => {
                onClose();
            }, 3000); // 3 saniye sonra otomatik kapanır
            return () => clearTimeout(timer);
        }
    }, [show, onClose]);

    return (
        <div
            style={{
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                backgroundColor: '#0C21C1',
                color: 'white',
                padding: '15px 25px',
                borderRadius: '8px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                opacity: show ? 1 : 0,
                transform: show ? 'translateY(0)' : 'translateY(100px)',
                transition: 'all 0.3s ease',
                pointerEvents: show ? 'auto' : 'none',
                zIndex: 9999,
            }}
        >
            {message}
        </div>
    );
}

export default Toast;
