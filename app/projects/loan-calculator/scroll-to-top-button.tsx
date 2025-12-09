"use client"

import { useEffect, useState } from "react"
import { ArrowUp } from "lucide-react"

import { cn } from "@/lib/utils"

export function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 100)
    }

    window.addEventListener("scroll", handleScroll)

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    })
  }

  return (
    <div 
      role="button" 
      className={cn(
        "fixed bottom-5 right-5 w-12 h-12 border rounded-full hover:bg-accent bg-accent/50 flex justify-center items-center opacity-0 transition",
        isVisible && "opacity-100"
      )}
      onClick={isVisible ? scrollToTop : () => null}  
    >
      <ArrowUp />
    </div>
  )
}