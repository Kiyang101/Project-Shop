"use client";

import * as React from "react";
import { motion, type Transition } from "motion/react";
import { EmblaOptionsType, EmblaCarouselType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { ChevronRight, ChevronLeft } from "lucide-react";
import ImageById from "@/components/ImageById";

// In motion-carousel.tsx, update PropType:
type PropType = {
  slides: {
    imageId: number;
    alt?: string;
    orientation: string;
  }[];
  options?: EmblaOptionsType;
  carouselOrientation: "horizontal" | "vertical";
};

type EmblaControls = {
  selectedIndex: number;
  scrollSnaps: number[];
  prevDisabled: boolean;
  nextDisabled: boolean;
  onDotClick: (index: number) => void;
  onPrev: () => void;
  onNext: () => void;
};

type DotButtonProps = {
  selected?: boolean;
  label: string;
  onClick: () => void;
};

const transition: Transition = {
  type: "spring",
  stiffness: 240,
  damping: 24,
  mass: 1,
};

const useEmblaControls = (
  emblaApi: EmblaCarouselType | undefined,
): EmblaControls => {
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

  const onSelect = React.useCallback((api: EmblaCarouselType) => {
    updateSelectionState(api);
  }, []);

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

function MotionCarousel(props: PropType) {
  const { slides, options, carouselOrientation } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const {
    selectedIndex,
    scrollSnaps,
    prevDisabled,
    nextDisabled,
    onDotClick,
    onPrev,
    onNext,
  } = useEmblaControls(emblaApi);
  const isVerticalScroll = carouselOrientation === "vertical";
  const isSingleSlide = slides.length === 1;
  const isDoubleSlide = slides.length === 2;

  // console.log("single slide:", isSingleSlide);
  // console.log("double slide:", isDoubleSlide);

  const check2Vertical = () => {
    if (!isDoubleSlide || isSingleSlide) return false;

    const verticalCount = slides.filter(
      (s) => s.orientation === "vertical",
    ).length;

    return verticalCount >= 1;
  };

  // console.log(check2Vertical());

  return (
    <div className="w-full space-y-4 [--slide-height:20rem] sm:[--slide-height:25rem] md:[--slide-height:30rem] [--slide-spacing:1rem] [--slide-size:70%] sm:[--slide-size:45%] select-none">
      <div
        className={`overflow-hidden ${isVerticalScroll ? "h-[500px]" : ""}`}
        ref={emblaRef}
      >
        <div
          className={`flex touch-pan-y touch-pinch-zoom 
            ${isSingleSlide ? "" : "ml-[calc(var(--slide-spacing)*-1)]"}  
            ${isSingleSlide ? "justify-center translate-x-[2.5%]" : ""}
            ${check2Vertical() ? "justify-center" : ""}
            ${isDoubleSlide ? "justify-start" : ""}
           ${isDoubleSlide ? "ml-[calc(var(--slide-spacing)*5)] " : ""}
          `}
        >
          {slides.map((slide, index) => {
            const isActive = index === selectedIndex;
            const isVerticalSlide = slide.orientation === "vertical";

            const getFlexBasis = () => {
              const isVert = slide.orientation === "vertical";

              if (isSingleSlide) return isVert ? "400px" : "80%";
              if (isDoubleSlide) return isVert ? "550px" : "80%";

              // Logic for 3+ slides
              // if (isVerticalScroll) return "100%"; // Stacked vertically
              return isVert ? "300px" : "70%"; // 3-up horizontally
            };
            return (
              <motion.div
                key={slide.imageId}
                className={`h-[var(--slide-height)] flex-none flex min-w-0 ${
                  isVerticalScroll
                    ? "mb-[var(--slide-spacing)] w-full"
                    : "mr-[var(--slide-spacing)] h-[400px]"
                }`}
                style={{
                  flexBasis: getFlexBasis(),
                }}
              >
                <motion.div
                  className="size-full flex items-center justify-center overflow-hidden border-4 rounded-xl bg-muted"
                  initial={false}
                  animate={{
                    /* 4. If it's the only slide, keep it at scale 1 and full opacity */
                    scale: isActive || isSingleSlide ? 1 : 0.9,
                    opacity: isActive || isSingleSlide ? 1 : 0.6,
                  }}
                  transition={transition}
                >
                  {/* <img
                    src={slide.src}
                    alt={slide.alt ?? ""}
                    className="h-full w-full object-cover pointer-events-none"
                  /> */}
                  <ImageById
                    imageId={slide.imageId}
                    className="h-full w-full object-cover pointer-events-none"
                    orientation={slide}
                  />
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-between">
        <Button
          size="icon"
          onClick={onPrev}
          disabled={prevDisabled}
          className="hover:cursor-pointer"
        >
          <ChevronLeft className="size-5" />
        </Button>

        <div className="flex flex-wrap justify-end items-center gap-2">
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              label={`${index + 1}`}
              selected={index === selectedIndex}
              onClick={() => onDotClick(index)}
            />
          ))}
        </div>

        <Button
          size="icon"
          onClick={onNext}
          disabled={nextDisabled}
          className="hover:cursor-pointer"
        >
          <ChevronRight className="size-5" />
        </Button>
      </div>
    </div>
  );
}

function DotButton({ selected = false, label, onClick }: DotButtonProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      layout
      initial={false}
      className="flex cursor-pointer select-none items-center justify-center rounded-full border-none bg-primary text-primary-foreground text-sm"
      animate={{
        width: selected ? 68 : 12,
        height: selected ? 28 : 12,
      }}
      transition={transition}
    >
      <motion.span
        layout
        initial={false}
        className="block whitespace-nowrap px-3 py-1"
        animate={{
          opacity: selected ? 1 : 0,
          scale: selected ? 1 : 0,
          filter: selected ? "blur(0)" : "blur(4px)",
        }}
        transition={transition}
      >
        {label}
      </motion.span>
    </motion.button>
  );
}

export { MotionCarousel };
