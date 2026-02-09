"use client"

import { useEffect } from "react"

export function ChannelTalk() {
    useEffect(() => {
        const loadChannelTalk = () => {
            const w = window as any
            if (w.ChannelIO) {
                return
            }
            const ch: any = function () {
                ch.c(arguments)
            }
            ch.q = []
            ch.c = function (args: any) {
                ch.q.push(args)
            }
            w.ChannelIO = ch
            function l() {
                if (w.ChannelIOInitialized) {
                    return
                }
                w.ChannelIOInitialized = true
                const s = document.createElement("script")
                s.type = "text/javascript"
                s.async = true
                s.src = "https://cdn.channel.io/plugin/ch-plugin-web.js"
                const x = document.getElementsByTagName("script")[0]
                if (x.parentNode) {
                    x.parentNode.insertBefore(s, x)
                }
            }
            if (document.readyState === "complete") {
                l()
            } else {
                w.addEventListener("DOMContentLoaded", l, false)
                w.addEventListener("load", l, false)
            }
        }

        loadChannelTalk()

        const w = window as any
        w.ChannelIO("boot", {
            pluginKey: "efc0ee16-4644-48dd-abc8-fd64a81cdc04",
        })

        return () => {
            w.ChannelIO("shutdown")
        }
    }, [])

    return null
}
