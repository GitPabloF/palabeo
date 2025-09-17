import Link from "next/link"
import {
  Sparkles,
  BookOpen,
  Trophy,
  CheckCircle2,
  ShieldCheck,
  Clock3,
} from "lucide-react"
import WordCard from "@/components/block/wordCard/wordCard"
import AppBackground from "@/components/block/appBackground"

const sampleWords = [
  {
    id: 101,
    wordFrom: "i can",
    wordTo: "puedo",
    typeCode: "adj",
    typeName: "verb",
    langFrom: "en",
    langTo: "es",
    exampleFrom: "I can speak Spanish, and you?",
    exampleTo: "Puedo hablar español, ¿y tú?",
  },
  {
    id: 102,
    wordFrom: "speak",
    wordTo: "hablar",
    typeCode: "v",
    typeName: "verb",
    langFrom: "en",
    langTo: "es",
    exampleFrom: "You will speak good Spanish now.",
    exampleTo: "Ahora hablarás bien español.",
  },
  {
    id: 103,
    wordFrom: "spanish",
    wordTo: "español",
    typeCode: "nm",
    typeName: "noun (m)",
    langFrom: "en",
    langTo: "es",
    exampleFrom: "I love Spanish.",
    exampleTo: "Me encanta el español.",
  },
]

const benefits = [
  {
    title: "Collectible motivation",
    desc: "Turn words into cards and watch your collection grow.",
    Icon: Sparkles,
  },
  {
    title: "Tiny daily practice",
    desc: "Quick sessions that fit your day and actually stick.",
    Icon: Clock3,
  },
  {
    title: "Real progress",
    desc: "Feel the improvement as your deck gets richer.",
    Icon: Trophy,
  },
  {
    title: "Simple by design",
    desc: "No overwhelm. Just words that matter to you.",
    Icon: BookOpen,
  },
  {
    title: "Built-in focus",
    desc: "Learn by type, theme, and language with intention.",
    Icon: CheckCircle2,
  },
  {
    title: "Privacy-first",
    desc: "Your space, your words. We respect your data.",
    Icon: ShieldCheck,
  },
]

export default function Home() {
  return (
    <main className="relative overflow-hidden group">
      {/* Background */}
      <AppBackground />

      {/* Hero */}
      <section className="px-6 py-20 md:py-28 max-w-6xl mx-auto text-center space-y-8">
        <div className="inline-flex items-center gap-2 rounded-full border bg-white/70 px-3 py-1 text-xs md:text-sm text-gray-600 shadow-sm">
          <span className="inline-block h-2 w-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
          Collect, practice, progress.
        </div>
        <h1 className="mx-auto max-w-3xl text-4xl md:text-6xl font-extrabold tracking-tight">
          <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
            Collect words like trading cards.
          </span>
        </h1>
        <p className="mx-auto max-w-2xl text-base md:text-lg text-gray-700">
          Turn vocabulary into a playful collection. Build your deck, keep your
          streak, and level up a little every day.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/login"
            className="rounded-md bg-blue-600 px-5 py-3 text-white font-semibold shadow-sm hover:bg-blue-600/90 transition relative overflow-hidden"
          >
            Log In
          </Link>
          <a
            href="/register"
            className="rounded-md border px-5 py-3 font-semibold text-gray-700 bg-white shadow-sm hover:bg-gray-50 transition"
          >
            Sign up
          </a>
        </div>

        {/* Preview Card Stack using WordCard */}
        <div className="mt-12 flex justify-center">
          <div className="relative group w-[320px] h-[440px]">
            {/* Back card */}
            <div className="absolute top-1/2 left-[calc(50%-56px)] w-[260px] -translate-y-1/2 -rotate-6 transition-all duration-500 group-hover:left-[calc(50%-72px)] z-0">
              <WordCard
                {...sampleWords[2]}
                createdAt={new Date().toISOString()}
              />
            </div>
            {/* Middle card */}
            <div className="absolute top-1/2 left-[calc(50%+56px)] w-[260px] -translate-y-1/2 rotate-6 transition-all duration-500 group-hover:left-[calc(50%+72px)] z-[5]">
              <WordCard
                {...sampleWords[1]}
                createdAt={new Date().toISOString()}
              />
            </div>
            {/* Front card */}
            <div className="absolute left-1/2 top-1/2 w-[270px] -translate-x-1/2 -translate-y-1/2 transition-transform duration-500 group-hover:scale-[1.02] z-10">
              <WordCard
                {...sampleWords[0]}
                createdAt={new Date().toISOString()}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-6 pb-20 max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Why Palabeo?
          </h2>
          <p className="mt-2 text-gray-600">
            Built to keep you consistent, curious, and having fun.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {benefits.map(({ title, desc, Icon }, idx) => (
            <div
              key={idx}
              className="rounded-2xl border bg-white p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 grid place-items-center text-gray-800">
                  <Icon className="size-5" />
                </div>
                <div className="font-semibold text-gray-900">{title}</div>
              </div>
              <p className="mt-3 text-sm text-gray-600">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 pb-28 max-w-5xl mx-auto">
        <div className="rounded-3xl border bg-white p-8 md:p-12 shadow-sm">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-sm font-semibold text-blue-700">1. Add</div>
              <p className="mt-2 text-gray-700">
                Save words you encounter. Palabeo turns them into beautiful
                cards.
              </p>
            </div>
            <div>
              <div className="text-sm font-semibold text-blue-700">
                2. Collect
              </div>
              <p className="mt-2 text-gray-700">
                Watch your collection grow, organized by type and language.
              </p>
            </div>
            <div>
              <div className="text-sm font-semibold text-blue-700">
                3. Practice
              </div>
              <p className="mt-2 text-gray-700">
                Short sessions to memorize without burnout. A little each day
                goes far.
              </p>
            </div>
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/login"
              className="rounded-md bg-blue-600 px-5 py-3 text-white font-semibold shadow-sm hover:bg-blue-600/90 transition"
            >
              Get started — Sign in
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 pb-28 max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">FAQ</h2>
        </div>
        <div className="space-y-4">
          <div className="rounded-xl border bg-white p-5">
            <div className="font-semibold text-gray-900">Is Palabeo free?</div>
            <p className="mt-1 text-sm text-gray-600">
              Palabeo will offer a generous free plan while in early access.
            </p>
          </div>
          <div className="rounded-xl border bg-white p-5">
            <div className="font-semibold text-gray-900">
              Which languages are supported?
            </div>
            <p className="mt-1 text-sm text-gray-600">
              Start with English, French, and Spanish. More coming soon.
            </p>
          </div>
          <div className="rounded-xl border bg-white p-5">
            <div className="font-semibold text-gray-900">
              How do I access my space?
            </div>
            <p className="mt-1 text-sm text-gray-600">
              Sign in to create your personal space. Your collection lives
              there.
            </p>
          </div>
        </div>
        <div className="text-center mt-8">
          <Link
            href="/login"
            className="rounded-md bg-blue-600 px-5 py-3 text-white font-semibold shadow-sm hover:bg-blue-600/90 transition"
          >
            Sign in to your space
          </Link>
        </div>
      </section>
    </main>
  )
}
