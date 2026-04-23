import React from 'react'
import { useTheme } from '../../context/ThemeContext';

export default function Loading({ text = "Loading...", fullScreen = true }) {

    const { isDark } = useTheme();

    const textColor = isDark ? 'text-white' : 'text-gray-900';
    const bgColor = isDark ? '' : '';
    return (
        <div className={fullScreen ? "min-h-screen flex items-center justify-center" : "flex items-center justify-center py-10", bgColor}>
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-green-600 mx-auto mb-4"></div>
                <p className={`${textColor} animate-pulse uppercase text-sm`}>{text}</p>
            </div>
        </div>
    );
}
