"use client";

import { useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import Container from "../Container";
import Button from "../Button";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import "./Hero.scss";

interface CtaLink {
  label: string;
  href: string;
}

export interface HeroSlide {
  label: string;
  titleLines: [string, string];
  description: string;
  primaryCta: CtaLink;
  secondaryCta: CtaLink;
  image: { src: string; alt: string };
}

interface HeroProps {
  slides: HeroSlide[];
}

const contentVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.44, delayChildren: 0.4 },
  },
  exit: {},
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.3, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function Hero({ slides }: HeroProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = slides[activeIndex];

  return (
    <section className="hero" aria-labelledby="hero-title">
      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={800}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop
        className="hero__swiper"
        onSlideChange={(swiper: SwiperType) => setActiveIndex(swiper.realIndex)}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={slide.image.src}>
            <div className="hero__media">
              <Image
                src={slide.image.src}
                alt={slide.image.alt}
                fill
                priority={index === 0}
                sizes="100vw"
                className="hero__image"
              />
              <div className="hero__scrim" aria-hidden="true" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <Container className="hero__content">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            className="hero__content-inner"
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.p className="hero__label" variants={itemVariants}>
              <span className="hero__label-line" aria-hidden="true" />
              {active.label}
            </motion.p>

            <motion.h1
              id="hero-title"
              className="hero__title"
              variants={itemVariants}
            >
              <span className="hero__title-line">{active.titleLines[0]}</span>
              <span className="hero__title-line hero__title-line--indent">
                {active.titleLines[1]}
              </span>
            </motion.h1>

            <motion.p className="hero__description" variants={itemVariants}>
              {active.description}
            </motion.p>

            <motion.div className="hero__actions" variants={itemVariants}>
              <Button
                type="button"
                variant="primary"
                size="lg"
                className="hero__cta"
                onClick={() => alert("아직 준비중입니다.")}
              >
                {active.primaryCta.label}
              </Button>
              <Button href={active.secondaryCta.href} variant="glass" size="lg">
                {active.secondaryCta.label}
              </Button>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </Container>

      <div className="hero__scroll" aria-hidden="true">
        <span className="hero__scroll-text">SCROLL</span>
        <span className="hero__scroll-line" />
      </div>
    </section>
  );
}
