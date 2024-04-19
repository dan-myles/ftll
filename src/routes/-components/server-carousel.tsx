import { type EmblaOptionsType } from "embla-carousel"
import { useFavoriteServerStore } from "@/stores/favorite-server-store"
import { EmblaCarousel } from "./embla-carousel"

const OPTIONS: EmblaOptionsType = { dragFree: true }

export function ServerCarousel() {
  const { serverList } = useFavoriteServerStore()

  return <EmblaCarousel cards={serverList} options={OPTIONS} />
}
