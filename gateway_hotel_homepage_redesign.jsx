import React from "react";
import { MapPin, Phone, Wifi, Coffee, Car, Accessibility, Star, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const rooms = [
  {
    title: "Two Double Beds",
    text: "Room for families or small groups, with space to relax after a day in Washington, DC.",
    tag: "Up to 4 guests",
  },
  {
    title: "One King Bed",
    text: "A comfortable option for solo travelers or couples looking for a quiet stay.",
    tag: "Best for 1–2 guests",
  },
  {
    title: "Accessible Room",
    text: "ADA-friendly room designed for easier access and a more comfortable experience.",
    tag: "Accessible stay",
  },
];

const attractions = ["Capitol Hill", "National Arboretum", "National Zoo", "Smithsonian Museum"];

export default function GatewayHotelHomepage() {
  return (
    <div className="min-h-screen bg-[#f7f4ee] text-slate-950">
      <header className="sticky top-0 z-50 border-b border-black/5 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-800 text-lg font-bold text-white shadow-sm">GH</div>
            <div>
              <p className="text-lg font-semibold tracking-wide">Gateway Hotel</p>
              <p className="text-xs text-slate-500">Washington, DC</p>
            </div>
          </div>
          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-700 md:flex">
            <a href="#rooms">Rooms</a>
            <a href="#location">Location</a>
            <a href="#attractions">Attractions</a>
            <a href="#contact">Contact</a>
          </nav>
          <Button className="rounded-full bg-emerald-800 px-6 hover:bg-emerald-900">Book Now</Button>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_10%,rgba(203,161,73,0.28),transparent_35%),linear-gradient(135deg,#0f2a3f_0%,#132f33_45%,#f7f4ee_45%)]" />
          <div className="relative mx-auto grid max-w-7xl gap-10 px-6 py-20 md:grid-cols-[1.05fr_.95fr] md:py-28">
            <div className="flex flex-col justify-center text-white md:pr-10">
              <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-sm backdrop-blur">
                <Star className="h-4 w-4" /> Comfortable rooms near DC landmarks
              </div>
              <h1 className="max-w-2xl text-5xl font-semibold leading-tight tracking-tight md:text-7xl">
                A modern stay with easy access to Washington, DC.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-white/80">
                Gateway Hotel offers convenient lodging near major airports, government agencies, and the city’s best-known attractions.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button className="rounded-full bg-amber-500 px-8 py-6 text-base text-slate-950 hover:bg-amber-400">
                  <CalendarDays className="mr-2 h-5 w-5" /> Check Availability
                </Button>
                <Button variant="outline" className="rounded-full border-white/30 bg-white/10 px-8 py-6 text-base text-white hover:bg-white/20">
                  View Rooms
                </Button>
              </div>
            </div>

            <Card className="overflow-hidden rounded-[2rem] border-0 bg-white shadow-2xl">
              <div className="h-72 bg-gradient-to-br from-emerald-700 via-emerald-900 to-slate-950 p-6 text-white">
                <div className="flex h-full flex-col justify-end rounded-[1.5rem] border border-white/15 bg-white/10 p-6 backdrop-blur-sm">
                  <p className="text-sm uppercase tracking-[0.3em] text-amber-200">Gateway Hotel</p>
                  <h2 className="mt-3 text-3xl font-semibold">Rest easy. Explore more.</h2>
                </div>
              </div>
              <CardContent className="grid gap-4 p-6 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-4"><MapPin className="mb-3 h-5 w-5 text-emerald-800" />2700 New York Avenue NE</div>
                <div className="rounded-2xl bg-slate-50 p-4"><Phone className="mb-3 h-5 w-5 text-emerald-800" />+1 202-832-5800</div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-16">
          <div className="grid gap-4 md:grid-cols-4">
            {[{ icon: Wifi, label: "Free Wi‑Fi" }, { icon: Coffee, label: "Coffee Maker" }, { icon: Car, label: "Airport Access" }, { icon: Accessibility, label: "ADA Rooms" }].map(({ icon: Icon, label }) => (
              <div key={label} className="rounded-3xl bg-white p-6 shadow-sm">
                <Icon className="mb-4 h-6 w-6 text-emerald-800" />
                <p className="font-semibold">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="rooms" className="mx-auto max-w-7xl px-6 py-12">
          <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="font-medium uppercase tracking-[0.25em] text-emerald-800">Rooms</p>
              <h2 className="mt-3 text-4xl font-semibold tracking-tight">Simple, comfortable, ready for your stay.</h2>
            </div>
            <p className="max-w-md text-slate-600">Each room includes air conditioning, private bathroom, fridge/microwave, LCD TV, and essentials for a practical stay.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {rooms.map((room) => (
              <Card key={room.title} className="overflow-hidden rounded-[1.75rem] border-0 shadow-sm">
                <div className="h-44 bg-gradient-to-br from-slate-200 to-amber-100" />
                <CardContent className="p-6">
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800">{room.tag}</span>
                  <h3 className="mt-5 text-2xl font-semibold">{room.title}</h3>
                  <p className="mt-3 text-slate-600">{room.text}</p>
                  <Button variant="outline" className="mt-6 rounded-full">Book This Room</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section id="attractions" className="bg-white py-16">
          <div className="mx-auto max-w-7xl px-6">
            <p className="font-medium uppercase tracking-[0.25em] text-emerald-800">Nearby</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight">Explore Washington, DC.</h2>
            <div className="mt-8 grid gap-4 md:grid-cols-4">
              {attractions.map((item) => (
                <div key={item} className="rounded-3xl bg-[#f7f4ee] p-6 font-semibold shadow-sm">{item}</div>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="mx-auto grid max-w-7xl gap-8 px-6 py-16 md:grid-cols-[.9fr_1.1fr]">
          <div>
            <p className="font-medium uppercase tracking-[0.25em] text-emerald-800">Contact</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight">Ready to plan your stay?</h2>
            <p className="mt-5 text-slate-600">Call the hotel or book online for availability and room options.</p>
          </div>
          <div className="rounded-[2rem] bg-slate-950 p-8 text-white">
            <p className="text-xl font-semibold">Gateway Hotel</p>
            <p className="mt-4 text-white/70">2700 New York Avenue NE</p>
            <p className="mt-2 text-white/70">+1 202 832 5800 · 1-800-324-9832</p>
            <Button className="mt-8 rounded-full bg-amber-500 px-8 text-slate-950 hover:bg-amber-400">Book Now</Button>
          </div>
        </section>
      </main>
    </div>
  );
}
