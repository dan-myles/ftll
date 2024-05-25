import Autoplay from "embla-carousel-autoplay"
import { useEffect, useState } from "react"
import {
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { type CarouselApi } from "@/components/ui/carousel"
import { useFavoriteServerStore } from "@/stores/favorite-server-store"
import { CarouselCard } from "./carousel-card"

export function ServerCarousel() {
  const { serverList } = useFavoriteServerStore()
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!api) {
      return
    }

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])

  return (
    <>
      <Carousel
        plugins={[Autoplay({ delay: 4500 })]}
        opts={{ loop: true, dragFree: true }}
        className="mx-auto w-full max-w-[750px] lg:max-w-[800px]
          xl:max-w-[1000px] 2xl:max-w-[1200px]"
        setApi={setApi}
      >
        <CarouselContent className="-ml-1">
          {serverList.map((server, idx) => (
            <CarouselCard initServer={server} key={idx} />
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <div className="mt-1 py-2 text-center text-sm text-muted-foreground">
        {current + "/" + count}
      </div>
    </>
  )
}
