import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useServerRankGraphData } from "@/hooks/useServerRankGraphData"
import { useTheme } from "next-themes"
import { Line, LineChart, ResponsiveContainer, Tooltip, YAxis } from "recharts"

interface RankChartProps {
  name: string
}

export function RankChart({ name }: RankChartProps) {
  const { theme: mode } = useTheme()
  const { theme } = useTheme()
  const { data, isLoading, error } = useServerRankGraphData(name)

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-normal">
              Rank History
            </CardTitle>
          </CardHeader>
          <CardContent className="flex h-[30vh] justify-center">
            <div className="mb-auto mt-auto text-gray-500">Loading...</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-normal">
              Rank History
            </CardTitle>
          </CardHeader>
          <CardContent className="flex h-[30vh] justify-center">
            <div className="mb-auto mt-auto text-red-400">
              There was an error loading rank information!
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (data?.data[0].attributes.value === 0) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-normal">
              Rank History
            </CardTitle>
          </CardHeader>
          <CardContent className="flex h-[30vh] justify-center">
            <div className="mb-auto mt-auto text-gray-500">
              We don't have any rank information for this server!
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Push all attributes to an array
  const attributes = data?.data.map((item) => {
    return {
      rank: item.attributes.value,
      timestamp: item.attributes.timestamp,
    }
  })

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-normal">Rank History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between">
            <div className="mb-6 text-2xl font-bold">
              #{data?.data[data?.data.length - 1].attributes.value}
            </div>
            <div className=" text-sm  text-muted-foreground hover:underline">
              In the last 30 days
            </div>
          </div>
          <div className="h-[30vh]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={attributes}
                margin={{
                  top: 10,
                  right: 10,
                  left: 0,
                  bottom: 10,
                }}
              >
                <YAxis
                  domain={["dataMin", "dataMax+1"]}
                  tickCount={5}
                  tick={{ fill: mode === "dark" ? "#9CA3AF" : "#4B5563" }}
                  axisLine={true}
                  tickLine={true}
                  tickMargin={10}
                  className="text-sm font-extralight"
                  style={
                    {
                      stroke: theme === "dark" ? "#9CA3AF" : "#4B5563",
                    } as React.CSSProperties
                  }
                  reversed={true}
                  scale="linear"
                  tickFormatter={(value) => {
                    return "#" + value
                  }}
                />

                <Line
                  type="monotone"
                  strokeWidth={2}
                  dataKey="rank"
                  activeDot={{
                    r: 2,
                    style: {
                      stroke: mode === "dark" ? "#eef2ff" : "black",
                      strokeWidth: 8,
                    },
                  }}
                  style={
                    {
                      stroke: theme === "dark" ? "#6366f1" : "black",
                    } as React.CSSProperties
                  }
                />
                <Tooltip
                  cursor={false}
                  contentStyle={{
                    backgroundColor: theme === "dark" ? "#171717" : "#fff",
                    color: theme === "dark" ? "#fff" : "#000",
                  }}
                  wrapperClassName="border border-accent rounded-md"
                  content={({ payload }) => {
                    if (!payload) {
                      return null
                    }
                    if (payload.length === 0) {
                      return null
                    }
                    return (
                      <div className="p-2">
                        <div>
                          <span className="font-bold">Rank:</span>{" "}
                          {"#" + payload[0].payload.rank}
                        </div>
                        <div>
                          <span className="font-bold">Date:</span>{" "}
                          {
                            new Date(payload[0].payload.timestamp)
                              .toLocaleString()
                              .split(",")[0]
                          }
                        </div>
                      </div>
                    )
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
