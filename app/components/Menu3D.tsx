"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"
import { useSearchParams } from "next/navigation"
import { menu } from "../data/menu"

/* 🌸 Sakura FIX SSR */
function Sakura() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-0 opacity-20">
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ y: -50, x: `${Math.random() * 100}%` }}
          animate={{ y: "110vh" }}
          transition={{
            duration: 12 + Math.random() * 6,
            repeat: Infinity
          }}
          className="absolute text-pink-300 text-xs"
        >
          ✿
        </motion.div>
      ))}
    </div>
  )
}

/* 🍣 ESCENA */
function SushiScene({ item, addToCart }: any) {
  const ref = useRef(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"]
  })

  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1.1])
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1])
  const y = useTransform(scrollYProgress, [0, 1], [80, 0])
  const blurValue = useTransform(scrollYProgress, [0, 1], [12, 0])

  const filter = useTransform(blurValue, (b) => `blur(${b}px)`)

  return (
    <section
      ref={ref}
      className="h-[120vh] flex items-center justify-center relative"
    >
      <div className="flex flex-col items-center text-center max-w-xl">

        <motion.div
          style={{ scale, opacity, y, filter }}
          className="mb-10"
        >
          <Image
            src={item.image}
            alt={item.nombre}
            width={500}
            height={400}
            className="object-contain drop-shadow-[0_50px_120px_rgba(0,0,0,0.9)]"
            priority
          />
        </motion.div>

        <motion.h2 style={{ opacity, y }} className="text-5xl font-light mb-4">
          {item.nombre}
        </motion.h2>

        <motion.p style={{ opacity, y }} className="text-gray-400 mb-6">
          {item.descripcion}
        </motion.p>

        <motion.p style={{ opacity, y }} className="text-2xl text-red-400 mb-8">
          ${item.precio} MXN
        </motion.p>

        <motion.button
          style={{ opacity, y }}
          whileTap={{ scale: 0.95 }}
          onClick={() => addToCart(item)}
          className="bg-white text-black px-8 py-3 rounded-full"
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

  /* ✅ FIX: evitar SSR mismatch */
  useEffect(() => {
    const m = searchParams.get("mesa")
    setMesa(m)
  }, [searchParams])

  const addToCart = (item: any) => {
    setCart((prev) => [...prev, item])
  }

  return (
    <div className="bg-black text-white min-h-screen overflow-x-hidden">

      <Sakura />

      {/* HEADER */}
      <div className="fixed top-0 left-0 w-full z-50 px-8 py-6 flex justify-between items-center">

        <div className="flex items-center gap-3">
          <Image
            src="/sushikomenu/Logo.png"
            alt="logo"
            width={40}
            height={40}
          />
          <span className="tracking-[0.2em] text-sm">SUSHIKO</span>
        </div>

        <div className="text-sm opacity-70">
          {mesa ? `Mesa ${mesa}` : "Mesa General"} • {cart.length}
        </div>
      </div>

      {/* MENU */}
      <div className="pt-20">
        {menu.map((item) => (
          <SushiScene
            key={item.id}
            item={item}
            addToCart={addToCart}
          />
        ))}
      </div>

      {/* CARRITO */}
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