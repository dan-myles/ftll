import { type EmblaOptionsType } from "embla-carousel"
import Autoplay from "embla-carousel-autoplay"
import useEmblaCarousel from "embla-carousel-react"
import { Bug, HeartCrack, Info, Play } from "lucide-react"
import React from "react"
import { Button } from "@/components/ui/button"
import { maps } from "@/data/map-filter-data"
import { type ServerList } from "@/schemas/ftla/server-schema"
import {
  NextButton,
  PrevButton,
  usePrevNextButtons,
} from "./embla-carousel-arrow-buttons"
import {
  SelectedSnapDisplay,
  useSelectedSnapDisplay,
} from "./embla-carousel-selected-snap-display"

type PropType = {
  cards: ServerList
  options?: EmblaOptionsType
}

const MAX_SERVER_NAME_LENGTH = 45

export const EmblaCarousel: React.FC<PropType> = (props) => {
  const { cards, options } = props
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [
    Autoplay({ playOnInit: true, delay: 4500 }),
  ])

  // eslint-disable-next-line
  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi)

  const { selectedSnap, snapCount } = useSelectedSnapDisplay(emblaApi)

  return (
    <>
      <div className="mb-[-12px] max-w-fit p-2 text-xl font-semibold">
        Favorite Servers
      </div>
      <section className="embla w-full p-2">
        <div className="embla__viewport" ref={emblaRef}>
          <div className="embla__container">
            {cards.map((server, idx) => (
              <div
                className="embla__slide m-2 h-[275px] max-w-[500px] rounded-md
                  border"
                key={idx}
              >
                <div
                  className="embla__slide__number mb-1 mt-1 flex flex-col
                    truncate p-4"
                >
                  <div className="border-b">
                    <div className="text-md font-semibold ">
                      {server.name.length > MAX_SERVER_NAME_LENGTH
                        ? `${server.name.substring(0, MAX_SERVER_NAME_LENGTH)}...`
                        : server.name}
                    </div>
                    <div className="text-sm text-gray-400 dark:text-gray-500">
                      {server.addr}
                    </div>
                  </div>
                  <div
                    className="flex flex-row justify-evenly space-x-12 pt-4
                      text-sm"
                  >
                    <div>
                      <div className="max-w-fit border-b font-semibold">
                        Map
                      </div>
                      {maps.find((m) => m.value === server.map)?.label ??
                        server.map}
                      {!maps.find((m) => m.value === server.map) && (
                        <span className="text-gray-400 dark:text-gray-500">
                          {" "}
                          (Unknown)
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="max-w-fit border-b font-semibold">
                        Ping
                      </div>
                      {server.ping}ms
                    </div>
                    <div>
                      <div className="max-w-fit border-b font-semibold">
                        Players
                      </div>
                      {server.players}/{server.maxPlayers}
                    </div>
                  </div>
                  <div className="inline-flex pt-10">
                    <div className="font-semibold">
                      Status<span className="font-normal">{" | "}</span>
                    </div>{" "}
                    <div className="pl-1 font-bold text-green-500">Online</div>
                  </div>
                  <div
                    className="ml-[-10px] flex flex-row justify-between
                      space-x-2 pt-10"
                  >
                    <div className="flex flex-row space-x-2">
                      <Button>
                        <Play size={16} />
                        <span className="pl-2">Join</span>
                      </Button>
                      <Button>
                        <Bug size={16} />
                        <span className="pl-2">Load</span>
                      </Button>
                      <Button>
                        <Bug size={16} />
                        <span className="pl-2">Fix Mods</span>
                      </Button>
                    </div>
                    <div className="flex-grow flex-row space-x-2">
                      <Button>
                        <Info size={16} />
                      </Button>
                      <Button variant="destructive">
                        <HeartCrack size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="embla__controls">
          <div className="embla__buttons">
            <PrevButton
              onClick={onPrevButtonClick}
              disabled={prevBtnDisabled}
            />
            <NextButton
              onClick={onNextButtonClick}
              disabled={nextBtnDisabled}
            />
          </div>

          <SelectedSnapDisplay
            selectedSnap={selectedSnap}
            snapCount={snapCount}
          />
        </div>
      </section>
    </>
  )
}
