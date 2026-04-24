"use client"
import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  AnimatePresence
} from "framer-motion"
import { useSearchParams } from "next/navigation"
import { menu } from "../data/menu"

/* 🔊 SONIDO */
function useSound() {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    audioRef.current = new Audio("/sounds/click.mp3")
  }, [])

  const play = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.play()
    }
  }

  return play
}

/* 🌸 Sakura */
function Sakura() {
  const sakuras = Array.from({ length: 10 }).map((_, i) => ({
    left: `${(i * 10) % 100}%`,
    delay: i * 0.5,
    duration: 10 + i
  }))

  return (
    <div className="fixed inset-0 pointer-events-none z-0 opacity-20">
      {sakuras.map((s, i) => (
        <motion.div
          key={i}
          initial={{ y: -50 }}
          animate={{ y: "110vh", rotate: 360 }}
          transition={{
            duration: s.duration,
            delay: s.delay,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{ left: s.left }}
          className="absolute text-pink-300 text-xs"
        >
          ✿
        </motion.div>
      ))}
    </div>
  )
}

/* 🍣 ESCENA */
function SushiScene({ item, addToCart, triggerFly }: any) {
  const ref = useRef(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"]
  })

  const smooth = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 20
  })

  const scale = useTransform(smooth, [0, 1], [0.8, 1.2])
  const opacity = useTransform(smooth, [0, 1], [0, 1])
  const y = useTransform(smooth, [0, 1], [120, 0])
  const blur = useTransform(smooth, [0, 1], [20, 0])

  const filter = useTransform(blur, (b) => `blur(${b}px)`)

  return (
    <section ref={ref} className="h-[130vh] flex items-center justify-center">
      <div className="flex flex-col items-center text-center max-w-xl">

        <motion.div style={{ scale, opacity, y, filter }}>
          <Image
            src={item.image + "?v=3"}
            alt={item.nombre}
            width={500}
            height={320}
            unoptimized
            className="drop-shadow-[0_80px_160px_rgba(0,0,0,1)]"
          />
        </motion.div>

        <motion.h2 style={{ opacity, y }} className="text-5xl mt-6">
          {item.nombre}
        </motion.h2>

        <motion.p style={{ opacity, y }} className="text-gray-400 mt-2">
          {item.descripcion}
        </motion.p>

        <motion.p style={{ opacity, y }} className="text-red-400 mt-4">
          ${item.precio} MXN
        </motion.p>

        <motion.button
          style={{ opacity, y }}
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.05 }}
          onClick={(e) => {
            const rect = (e.target as HTMLElement).getBoundingClientRect()
            triggerFly(item, rect)
            addToCart(item)
          }}
          className="bg-white text-black px-8 py-3 rounded-full mt-6"
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
  const [flyItem, setFlyItem] = useState<any>(null)

  const params = useSearchParams()
  const mesa = params.get("mesa") || "General"

  const playSound = useSound()

  const addToCart = (item: any) => {
    playSound()
    setCart((prev) => [...prev, item])
  }

  const triggerFly = (item: any, rect: DOMRect) => {
    setFlyItem({
      item,
      x: rect.left,
      y: rect.top
    })

    setTimeout(() => setFlyItem(null), 800)
  }

  const total = cart.reduce((acc, i) => acc + i.precio, 0)

  return (
    <div className="bg-black text-white min-h-screen">

      <Sakura />

      {/* 🔥 HEADER CON LOGO */}
      <div className="fixed top-0 left-0 w-full z-50 px-8 py-6 flex justify-between items-center">

        <div className="flex items-center gap-4">
          <Image
            src="/sushi/Logo.png"
            alt="SUSHIKO logo"
            width={100}
            height={100}
            className="object-contain"
          />
          <span className="tracking-[0.3em] text-sm">SUSHIKO</span>
        </div>

        <div className="text-xs opacity-70">
          Mesa {mesa} • {cart.length}
        </div>
      </div>

      {/* MENU */}
      <div className="pt-24">
        {menu.map((item) => (
          <SushiScene
            key={item.id}
            item={item}
            addToCart={addToCart}
            triggerFly={triggerFly}
          />
        ))}
      </div>

      {/* ITEM VOLANDO */}
      <AnimatePresence>
        {flyItem && (
          <motion.div
            initial={{
              x: flyItem.x,
              y: flyItem.y,
              scale: 1
            }}
            animate={{
              x: window.innerWidth - 80,
              y: 40,
              scale: 0.2,
              opacity: 0.5
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="fixed z-[999]"
          >
            <Image
              src={flyItem.item.image}
              alt=""
              width={120}
              height={80}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* CARRITO */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 w-full px-6 py-4 bg-black/80 backdrop-blur-xl border-t border-white/10">
          <div className="flex justify-between">

            <span>
              {cart.length} • ${total} MXN
            </span>

            <button
              onClick={async () => {
                await fetch("/api/order", {
                  method: "POST",
                  body: JSON.stringify({
                    mesa,
                    items: cart
                  })
                })

                alert("Pedido enviado 🍣")
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