"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"
import { useSearchParams } from "next/navigation"
import { menu } from "../data/menu"

/* 🌸 Sakura FIX PRODUCCIÓN */
function Sakura() {
  const [mounted, setMounted] = useState(false)
  const [positions, setPositions] = useState<number[]>([])

  useEffect(() => {
    setMounted(true)
    // Generar posiciones SOLO en cliente (evita hydration error)
    setPositions(Array.from({ length: 12 }, () => Math.random() * 100))
  }, [])

  if (!mounted) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {positions.map((x, i) => (
        <motion.div
          key={i}
          initial={{ y: -50, x: `${x}vw` }}
          animate={{ y: "110vh" }}
          transition={{
            duration: 10 + i,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute text-pink-300 text-xs opacity-30"
        >
          ✿
        </motion.div>
      ))}
    </div>
  )
}

/* 🍣 ESCENA */
function SushiScene({ item, addToCart, playSound }: any) {
  const { scrollYProgress } = useScroll()

  const scale = useTransform(scrollYProgress, [0, 1], [0.95, 1.05])
  const opacity = useTransform(scrollYProgress, [0, 1], [0.6, 1])
  const blurValue = useTransform(scrollYProgress, [0, 1], [10, 0])
  const filter = useTransform(blurValue, (b) => `blur(${b}px)`)

  return (
    <section className="h-[120vh] flex items-center justify-center">
      <div className="flex flex-col items-center text-center max-w-xl">

        {/* 🍣 IMAGEN */}
        <motion.div style={{ scale, opacity, filter }} className="mb-10">
          <Image
            src={item.image}
            alt={item.nombre}
            width={500}
            height={400}
            className="object-contain drop-shadow-[0_50px_120px_rgba(0,0,0,0.9)]"
            priority
          />
        </motion.div>

        {/* 🧾 TEXTO */}
        <motion.h2 style={{ opacity }} className="text-5xl font-light mb-4">
          {item.nombre}
        </motion.h2>

        <motion.p style={{ opacity }} className="text-gray-400 mb-6">
          {item.descripcion}
        </motion.p>

        <motion.p style={{ opacity }} className="text-2xl text-red-400 mb-8">
          ${item.precio} MXN
        </motion.p>

        {/* 🔊 BOTÓN */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            playSound()
            addToCart(item)
          }}
          className="bg-white text-black px-8 py-3 rounded-full hover:scale-105 transition"
        >
          Agregar
        </motion.button>
      </div>
    </section>
  )
}

/* 🧠 MAIN */
export default function Menu3D() {
  const [cart, setCart] = useState<any[]>([])
  const [mesa, setMesa] = useState<string | null>(null)

  const searchParams = useSearchParams()

  /* 📲 MESA (QR) */
  useEffect(() => {
    const m = searchParams.get("mesa")
    setMesa(m)
  }, [searchParams])

  /* 🔊 AUDIO FIX REAL (SIN REF BUG) */
  const playSound = () => {
    const audio = new Audio("/sushi/click.mp3")
    audio.volume = 0.4
    audio.play().catch(() => {
      console.log("audio bloqueado")
    })
  }

  const addToCart = (item: any) => {
    setCart((prev) => [...prev, item])
  }

  return (
    <div className="bg-black text-white min-h-screen overflow-x-hidden">

      {/* 🌸 Sakura */}
      <Sakura />

      {/* 🔝 HEADER */}
      <div className="fixed top-0 left-0 w-full z-50 px-8 py-6 flex justify-between items-center">

        {/* ✅ LOGO CORREGIDO */}
        <div className="flex items-center gap-3">
          <Image
            src="/sushi/Logo.png"
            alt="logo"
            width={40}
            height={40}
            priority
          />
          <span className="tracking-[0.2em] text-sm">SUSHIKO</span>
        </div>

        <div className="text-sm opacity-70">
          {mesa ? `Mesa ${mesa}` : "Mesa General"} • {cart.length}
        </div>
      </div>

      {/* 🍣 MENU */}
      <div className="pt-20">
        {menu.map((item) => (
          <SushiScene
            key={item.id}
            item={item}
            addToCart={addToCart}
            playSound={playSound}
          />
        ))}
      </div>

      {/* 🧾 CARRITO */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 w-full px-6 py-4 bg-black/70 backdrop-blur-xl border-t border-white/10">
          <div className="flex justify-between items-center">

            <span>{cart.length} items</span>

            <button
              onClick={() => {
                const items = cart.map(i => i.nombre).join(", ")
                window.open(
                  `https://wa.me/521XXXXXXXXXX?text=${encodeURIComponent(
                    `Mesa ${mesa || "General"}: ${items}`
                  )}`
                )
              }}
              className="bg-red-600 px-6 py-2 rounded-full"
            >
              Ordenar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}