import { Fragment, useEffect, useState, forwardRef } from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { cn } from "@/lib/utils"

export type DoubleSliderProps = {
  className?: string
  min: number
  max: number
  minStepsBetweenThumbs: number
  step: number
  formatLabel?: (value: number) => string
  value?: number[] | readonly number[]
  onValueChange?: (values: number[]) => void
}

const DoubleSlider = forwardRef(
  (
    {
      className,
      min,
      max,
      step,
      formatLabel,
      value,
      onValueChange,
      ...props
    }: DoubleSliderProps,
    ref
  ) => {
    const initialValue = Array.isArray(value) ? value : [min, max]
    const [localValues, setLocalValues] = useState(initialValue)

    useEffect(() => {
      // Update localValues when the external value prop changes
      setLocalValues(Array.isArray(value) ? value : [min, max])
    }, [min, max, value])

    const handleValueChange = (newValues: number[]) => {
      setLocalValues(newValues)
      if (onValueChange) {
        onValueChange(newValues)
      }
    }

    return (
      <SliderPrimitive.Root
        ref={ref as React.RefObject<HTMLDivElement>}
        min={min}
        max={max}
        step={step}
        value={localValues}
        onValueChange={handleValueChange}
        className={cn(
          "relative mb-6 flex w-full touch-none select-none items-center",
          className
        )}
        {...props}
      >
        <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20">
          <SliderPrimitive.Range className="absolute h-full bg-primary" />
        </SliderPrimitive.Track>
        {localValues.map((value, index) => (
          <Fragment key={index}>
            <SliderPrimitive.Thumb className="block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
              <div className="absolute -top-8 left-1/2 z-30 -translate-x-1/2 transform rounded-md border bg-popover px-2 text-sm text-popover-foreground shadow-sm">
                {formatLabel ? formatLabel(value) : value}
              </div>
            </SliderPrimitive.Thumb>
          </Fragment>
        ))}
      </SliderPrimitive.Root>
    )
  }
)

DoubleSlider.displayName = SliderPrimitive.Root.displayName

export { DoubleSlider as Slider }
