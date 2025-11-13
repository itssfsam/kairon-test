"use client"

import { Theme, useTheme } from "./theme-provider";

export default function Header() {
    const { theme } = useTheme();

    const bgClass =
        theme === Theme.DARK
            ? 'bg-gray-900/30 border-gray-700'
            : 'bg-white/30 border-white/20';

    const textGradient =
        theme === Theme.DARK
            ? 'from-green-300 via-blue-500 to-purple-600 text-5xl font-black'
            : 'from-purple-400 via-pink-500 to-red-500';

    return (
        <header
            className={`w-full max-w-7xl mx-auto p-8 mb-8 rounded-xl 
                  ${bgClass} backdrop-blur-md border`}
        >
            <h1
                className={`text-3xl sm:text-5xl font-bold 
                    bg-gradient-to-r ${textGradient} 
                    bg-clip-text text-transparent text-center`}
            >
                Kairon Labs Test ETH Price Watch and Trade
            </h1>
        </header>
    )
}
