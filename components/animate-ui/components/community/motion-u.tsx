"use client";

import * as React from "react";
import { motion, type Transition } from "motion/react";
import { EmblaOptionsType, EmblaCarouselType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import { Button } from "@/components/animate-ui/components/buttons/button";
import {
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

export type CarouselImage = {
  id: string | number;
  src: string;
  alt: string;
  // Now you can set orientation for each specific image
  orientation?: "horizontal" | "vertical";
};

type PropType = {
  slides: CarouselImage[];
  options?: EmblaOptionsType;
  carouselOrientation?: "horizontal" | "vertical"; // The scroll direction
};

// ... (useEmblaControls hook remains the same as before)
const useEmblaControls = (emblaApi: EmblaCarouselType | undefined) => {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([]);
  const [prevDisabled, setPrevDisabled] = React.useState(true);
  const [nextDisabled, setNextDisabled] = React.useState(true);
  const onDotClick = React.useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi],
  );
  const onPrev = React.useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const onNext = React.useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const updateSelectionState = (api: EmblaCarouselType) => {
    setSelectedIndex(api.selectedScrollSnap());
    setPrevDisabled(!api.canScrollPrev());
    setNextDisabled(!api.canScrollNext());
  };
  const onInit = React.useCallback((api: EmblaCarouselType) => {
    setScrollSnaps(api.scrollSnapList());
    updateSelectionState(api);
  }, []);
  const onSelect = React.useCallback(
    (api: EmblaCarouselType) => updateSelectionState(api),
    [],
  );
  React.useEffect(() => {
    if (!emblaApi) return;
    onInit(emblaApi);
    emblaApi.on("reInit", onInit).on("select", onSelect);
    return () => {
      emblaApi.off("reInit", onInit).off("select", onSelect);
    };
  }, [emblaApi, onInit, onSelect]);
  return {
    selectedIndex,
    scrollSnaps,
    prevDisabled,
    nextDisabled,
    onDotClick,
    onPrev,
    onNext,
  };
};

const transition: Transition = {
  type: "spring",
  stiffness: 240,
  damping: 24,
  mass: 1,
};

function MotionCarousel({
  slides,
  options,
  carouselOrientation = "horizontal",
}: PropType) {
  const isVerticalScroll = carouselOrientation === "vertical";

  const [emblaRef, emblaApi] = useEmblaCarousel({
    ...options,
    axis: isVerticalScroll ? "y" : "x",
  });

  const {
    selectedIndex,
    scrollSnaps,
    prevDisabled,
    nextDisabled,
    onDotClick,
    onPrev,
    onNext,
  } = useEmblaControls(emblaApi);

  return (
    <div className={`w-full space-y-4 [--slide-spacing:1rem]`}>
      <div
        className={`overflow-hidden rounded-xl ${isVerticalScroll ? "h-[500px]" : ""}`}
        ref={emblaRef}
      >
        <div
          className={`flex ${isVerticalScroll ? "flex-col h-full" : "flex-row"}`}
        >
          {slides.map((slide, index) => {
            const isActive = index === selectedIndex;

            // Check if THIS specific slide is vertical
            const isVerticalSlide = slide.orientation === "vertical";

            return (
              <motion.div
                key={slide.id}
                className={`flex-none min-w-0 flex items-center justify-center ${
                  isVerticalScroll
                    ? "mb-[var(--slide-spacing)] w-full"
                    : "mr-[var(--slide-spacing)] h-[400px]"
                }`}
                style={{
                  // Adjust the width/basis based on the individual slide's orientation
                  flexBasis: isVerticalSlide ? "300px" : "80%",
                }}
              >
                <motion.div
                  className={`relative size-full overflow-hidden rounded-2xl border-2 bg-muted/10 shadow-xl`}
                  initial={false}
                  animate={{
                    scale: isActive ? 1 : 0.9,
                    opacity: isActive ? 1 : 0.5,
                  }}
                  transition={transition}
                >
                  <img
                    src={slide.src}
                    alt={slide.alt}
                    className="absolute inset-0 size-full object-cover"
                  />
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center">
        <Button
          size="icon"
          variant="outline"
          onClick={onPrev}
          disabled={prevDisabled}
        >
          {isVerticalScroll ? <ChevronUp /> : <ChevronLeft />}
        </Button>
        <div className="flex gap-2">
          {scrollSnaps.map((_, i) => (
            <Button
              key={i}
              onClick={() => onDotClick(i)}
              className={`size-2 rounded-full transition-colors ${i === selectedIndex ? "bg-primary" : "bg-muted"}`}
            />
          ))}
        </div>
        <Button
          size="icon"
          variant="outline"
          onClick={onNext}
          disabled={nextDisabled}
        >
          {isVerticalScroll ? <ChevronDown /> : <ChevronRight />}
        </Button>
      </div>
    </div>
  );
}

export { MotionCarousel };
