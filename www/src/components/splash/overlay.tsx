"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Octokit } from "@octokit/rest"
import { Icons } from "../icons"
import { Logo } from "../logo"

export function Overlay() {
  const [loaded, setLoaded] = useState(false)
  const [unmountLoading, setUnmountLoading] = useState(false)
  const router = useRouter()

  async function downloadLatestRelease() {
    const octokit = new Octokit()
    const { data } = await octokit.repos.getLatestRelease({
      owner: "avvo-na",
      repo: "ftll",
    })
    if (!data) return
    // find the browser_download_url within assets that has x64-setup.exe
    // @ts-expect-error not sure
    const download_url = data.assets.find((asset) =>
      asset.browser_download_url.includes("x64-setup.exe")
    ).browser_download_url
    console.log(download_url)
    // redirect to the download url
    router.push(download_url)
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoaded(true)
    }, 750)
    return () => {
      clearTimeout(timeout)
    }
  }, [])

  return (
    <>
      {/* Main content */}
      <div
        className="absolute left-0 right-0 top-[calc(30vh)] z-20 ml-auto mr-auto
          flex max-w-[55vw] items-center text-white"
      >
        <div
          className="flex min-w-[55vw] flex-col justify-center text-center
            md:min-w-[20vw]"
        >
          <div className="flex justify-center pb-4">
            <Logo />
          </div>
          <p className="text-balance text-base md:text-lg xl:text-2xl">
            A next-generation, open-source, blazingly fast launcher for{" "}
            <span className="text-red-400">DayZ</span>
          </p>
          <div
            className="mt-4 flex flex-col justify-center space-y-2 md:flex-row
              md:space-x-2 md:space-y-0"
          >
            <button
              className="inline-flex items-center self-center rounded-md
                bg-slate-800 p-2 text-[14px] font-light transition-colors
                duration-200 ease-in-out hover:bg-slate-700 focus:outline-none
                focus:ring-2 focus:ring-slate-600 focus:ring-offset-2
                focus:ring-offset-slate-800 xl:p-3"
              onClick={() => downloadLatestRelease()}
            >
              <Image
                src="/externals/windows-logo.svg"
                alt="windows"
                width={20}
                height={20}
                className="ml-2 mr-2"
              />
              <span className="">Download for Windows</span>
            </button>
            <a href="https://github.com/avvo-na/ftll">
              <button
                className="inline-flex items-center self-center rounded-md
                  bg-[#2b3137] p-2 text-[14px] font-light transition-colors
                  duration-200 ease-in-out hover:bg-slate-950 focus:outline-none
                  focus:ring-2 focus:ring-slate-600 focus:ring-offset-2
                  focus:ring-offset-slate-800 xl:p-3"
              >
                <div className="inline-flex">
                  <Icons.github className="h-5 w-5" />
                  <span className="block pl-2 md:hidden">Github</span>
                </div>
              </button>
            </a>
            <a href="https://discord.gg/xujqFZsEac">
              <button
                className="inline-flex items-center self-center rounded-md
                  bg-[#5865F2] p-2 text-[14px] font-light transition-colors
                  duration-200 ease-in-out hover:bg-slate-950 focus:outline-none
                  focus:ring-2 focus:ring-slate-600 focus:ring-offset-2
                  focus:ring-offset-slate-800 xl:p-3"
              >
                <div className="inline-flex">
                  <Icons.discord className="h-5 w-5" />
                  <span className="block pl-2 md:hidden">Discord</span>
                </div>
              </button>
            </a>
          </div>
        </div>
        <Image
          src="/app-demo.png"
          alt="app demo"
          width={700}
          height={700}
          quality={100}
          className="hidden md:block"
          priority
        />
      </div>

      {/* Loading screen */}
      {!unmountLoading && (
        <div
          className={`fixed left-0 top-0 z-[1000] flex h-full w-full
          items-center justify-center bg-gradient-to-br from-neutral-950
          to-neutral-900 transition-opacity duration-500 ${
            loaded ? "opacity-0" : "opacity-100"
          }`}
          onTransitionEnd={() => setUnmountLoading(true)}
        >
          <div className="relative">
            <div className="relative text-center text-xl font-bold text-white">
              <Image
                src="/gifs/zombie.gif"
                alt="zombie"
                width={125}
                height={125}
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
