'use client'
import { motion } from 'framer-motion'
import Image from "next/image";

export function Logo() {
    return (
        <motion.header
            className="text-center py-8  "
            initial={{opacity: 0, y: -20}}
            animate={{opacity: 1, y: 0}}

        >   <div className="flex flex-cols justify-center">
            <Image alt="Navira Logo" src={`/logo.png`} width={50} height={30} className="dark"/>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 text-transparent bg-clip-text">
                NAVIRA
            </h1>
        </div>
            <p className="text-gray-400 text-lg">
                Searching Is Now Made Easy
            </p>
        </motion.header>
    )
}