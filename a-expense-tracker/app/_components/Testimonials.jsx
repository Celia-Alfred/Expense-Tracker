"use client";

import React from "react";
import Slider from "react-slick";
import { FaStar } from "react-icons/fa";

const testimonials = [
  {
    name: "Luis F.",
    feedback: "“The easiest expense tool I've ever used.”",
    detail:
      "It is very very easy, as soon as you get a receipt you can scan it. The AI will capture all relevant information with very little interaction needed. It is so easy!!!",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Kirsten H.",
    feedback: "“Great Program!”",
    detail:
      "Expensify has a great UI and is very intuitive. I love taking a picture of a receipt and having it uploaded instantly to my account!",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Weston M.",
    feedback: "“Simple, Straight-forward Expenses!”",
    detail:
      "Expensify makes tracking expenses simple and quick with auto-import and receipt capture. A huge time-saver for busy professionals.",
    image: "https://randomuser.me/api/portraits/men/88.jpg",
  },
];

const Testimonials = () => {
  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 4000,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    <div className="bg-[#0f172a] py-16 px-4 md:px-6 text-white">
      <div className="text-center mb-10">
        <div className="flex justify-center items-center gap-2 text-blue-400 text-2xl font-medium">
          <span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span>
          <p className="text-white text-lg ml-3">4.5 (4,889 reviews)</p>
        </div>
        <h2 className="text-3xl font-bold mt-4">What People Are Saying</h2>
      </div>

      <Slider {...settings}>
        {testimonials.map((t, idx) => (
          <div key={idx} className="px-4">
            <div className="bg-[#1e293b] text-gray-100 p-8 rounded-xl shadow-md max-w-3xl mx-auto border border-blue-600">
              <div className="flex gap-1 text-blue-400 mb-2">
                {[...Array(5)].map((_, i) => <FaStar key={i} />)}
              </div>
              <p className="font-semibold text-xl text-white mb-2">{t.feedback}</p>
              <p className="text-gray-300 text-sm mb-5">{t.detail}</p>
              <div className="flex items-center gap-3">
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-10 h-10 rounded-full border-2 border-blue-500"
                />
                <span className="font-semibold text-white">{t.name}</span>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Testimonials;
