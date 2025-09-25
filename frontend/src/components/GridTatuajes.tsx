"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

const images = [
  "/tattoos/tattoo1.jpg",
  "/tattoos/tattoo2.jpg",
  "/tattoos/tattoo3.jpg",
  "/tattoos/tattoo4.jpg",
  "/tattoos/tattoo5.jpg",
  "/tattoos/tattoo6.jpg",
  "/tattoos/tattoo7.jpg",
  "/tattoos/tattoo8.jpg",
  "/tattoos/tattoo10.jpg",
]

export default function GridTatuajes() {

    const [selectedImage, setSelectedImage] = useState<string | null>(null)
    const [zoom, setZoom] = useState(false)

    return (
        <section id="tattoos" className="py-16 bg-gray-900">
            <div className="max-w-6xl mx-auto px-4">
                <h2 className="text-3xl font-bold text-center text-white mb-12">
                    Trabajos recientes
                </h2>

                {/* Grid de imágenes */}
                <div className="px-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-8">
                {images.map((src, i) => (
                    <motion.div
                    key={i}
                    className="relative overflow-hidden rounded-2xl shadow-lg cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    onClick={() => {
                        setSelectedImage(src)
                        setZoom(false)
                    }}
                    >
                    <Image
                        src={src}
                        alt={`Tatuaje ${i + 1}`}
                        width={400}
                        height={400}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition flex items-center justify-center">
                        <p className="text-white text-lg font-semibold">Ver más</p>
                    </div>
                    </motion.div>
                ))}
                </div>
            </div>

            {/* Modal / Lightbox */}
            <AnimatePresence>
                {selectedImage && (
                <motion.div
                    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            setSelectedImage(null)
                        }
                    }}
                >
                    <motion.img
                        src={selectedImage}
                        alt="Preview"
                        className={`max-h-[90%] max-w-[90%] rounded-2xl shadow-xl cursor-${zoom ? "zoom-out" : "zoom-in"}`}
                        initial={{ scale: 1 }}
                        animate={{ scale: zoom ? 2 : 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                        onClick={() => setZoom(!zoom)}
                        drag={zoom ? true : false}
                        dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
                        dragElastic={0.2}
                    />
                </motion.div>
                )}
            </AnimatePresence>
        </section>
    )
}