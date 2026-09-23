"use client";

import { Star, Quote } from "lucide-react";

import { Badge } from "../ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Card, CardContent, CardFooter } from "../ui/card";
import { testimonials } from "./testimonials.mock";

export default function TestimonialsSection() {
  return (
    <section className="w-full bg-slate-900 flex justify-center items-center py-20 md:py-28 overflow-hidden relative border-t border-slate-800">
      <div className="absolute top-1/4 left-1/4 w-112.5 h-112.5 bg-blue-600/4 rounded-full blur-[130px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-112.5 h-112.5 bg-orange-500/4 rounded-full blur-[130px] pointer-events-none -z-10" />

      <div className="w-11/12 max-w-7xl flex flex-col gap-16">
        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-4 max-w-2xl">
          <Badge
            variant="outline"
            className="gap-2 border-white/5 bg-linear-to-r from-blue-500/10 to-orange-500/10 px-3 py-1 text-xs font-semibold tracking-wider text-orange-500 uppercase shadow-inner"
          >
            Early Access Reviews
          </Badge>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Loved by local vendors. <br className="hidden sm:inline" />
            Trusted by busy teams.
          </h2>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-1">
            <div className="flex items-center gap-0.5 text-amber-400">
              {["one", "two", "three", "four", "five"].map((star) => (
                <Star key={star} className="w-4 h-4 fill-orange-500" />
              ))}
            </div>
            <span className="text-sm font-medium text-slate-300">
              The honest standard for building-wide office ordering.
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-12 gap-6 w-full">
          {testimonials.map((item) => (
            <Card
              key={item.id}
              className={`group relative bg-transparent bg-linear-to-b from-white/3 to-white/1 border border-white/5 p-8 rounded-3xl shadow-xl transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl hover:border-white/10 flex flex-col justify-between overflow-hidden backdrop-blur-sm ${item.gridSpan}`}
            >
              <div
                className={`absolute -right-20 -top-20 w-48 h-48 bg-linear-to-br ${item.accentGlow} rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`}
              />

              <Quote className="absolute right-8 top-8 w-16 h-16 text-white/1.5 group-hover:text-white/3 group-hover:scale-110 transition-all duration-500 transform rotate-180 pointer-events-none" />

              <CardContent className="p-0 mb-8 max-w-3xl relative z-10">
                <p className="text-base sm:text-lg text-slate-200 font-light tracking-wide leading-relaxed antialiased">
                  {item.quote}
                </p>
              </CardContent>

              <CardFooter className="p-0 flex items-center justify-between gap-4 pt-4 border-t border-white/5 relative z-10 mt-auto bg-transparent">
                <div className="flex items-center gap-3">
                  <Avatar className="size-10 border border-white/10 bg-linear-to-tr from-slate-800 to-slate-700 text-sm text-slate-200 shadow-inner transition-all duration-300 group-hover:from-slate-700 group-hover:to-slate-600">
                    <AvatarImage
                      src={item.avatarUrl}
                      alt={item.author}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-transparent font-bold text-inherit flex items-center justify-center w-full h-full">
                      {item.author.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="text-sm font-bold text-white tracking-wide">
                      {item.author}
                    </h4>
                    <p className="text-xs text-slate-400 font-light mt-0.5">
                      {item.role}
                    </p>
                  </div>
                </div>

                <Badge
                  variant="outline"
                  className="gap-1.5 border-white/5 bg-white/2 px-3 py-1 text-[11px] font-medium text-slate-300 shadow-sm transition-all duration-300 group-hover:bg-white/5"
                >
                  {item.icon}
                  {item.tag}
                </Badge>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
