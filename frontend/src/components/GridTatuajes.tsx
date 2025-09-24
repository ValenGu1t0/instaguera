"use client"

import Image from "next/image"
import { motion } from "framer-motion"

const images = [
  "/tattoos/tattoo1.jpg",
  "/tattoos/tattoo2.jpg",
  "/tattoos/tattoo3.jpg",
  "/tattoos/tattoo4.jpg",
  "/tattoos/tattoo5.jpg",
  "/tattoos/tattoo6.jpg",
  "/tattoos/tattoo7.jpg",
  "/tattoos/tattoo8.jpg",
  "/tattoos/tattoo9.jpg",
  "/tattoos/tattoo10.jpg",
]

export default function GridTatuajes() {

    return (
        <section className="py-16 bg-gray-900">

            <div className="max-w-6xl mx-auto px-4">

                <h2 className="text-3xl font-bold text-center text-white mb-10">
                Trabajos recientes
                </h2>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {images.map((src, i) => (
                        <motion.div
                        key={i}
                        className="relative overflow-hidden rounded-2xl shadow-lg"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        >
                        <Image
                            src={src}
                            alt={`Tatuaje ${i + 1}`}
                            width={400}
                            height={400}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition flex items-center justify-center">
                            <p className="text-white text-lg font-semibold">Tatuaje {i + 1}</p>
                        </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}