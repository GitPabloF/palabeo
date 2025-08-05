"use client"

import { useUser } from "@/contexts/UserContext"
import InfoCard from "@/components/block/infoCard"
import { useRouter } from "next/navigation"
import { FEATURES as features } from "@/content/main"

export default function App() {
  const { currentUser } = useUser()
  const router = useRouter()

  // reorder features : collection last, remove settings
  const activités = features
    .filter((feature) => feature.name !== "settings")
    .sort((a, b) => {
      if (a.name === "collection") return 1
      if (b.name === "collection") return -1
      return 0
    })

  const handleActivityClick = (route: string) => {
    router.push(route)
  }

  return (
    <div className="space-y-8">
      {/* Header avec message de bienvenue */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-800">
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Hello {currentUser?.name || "Apprenant"}
          </span>{" "}
          👋
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          What do you want to do today?
        </p>
      </div>

      {/* Design Bento avec les activités */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
        {activités.map((activity, index) => (
          <div
            key={index}
            className={`transform hover:scale-105 transition-transform duration-300 ${
              index === 2 ? "md:col-span-2" : ""
            }`}
          >
            <InfoCard
              title={activity.name}
              description={activity.description}
              colorType={activity.color}
              button={{
                text: "Start",
                icon: <activity.icon />,
              }}
              onStartQuiz={() => handleActivityClick(activity.route)}
            />
          </div>
        ))}
      </div>

      {/* Section de motivation */}
      <div className="mt-12 text-center">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-8 border border-blue-100">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">
            Keep up your progress! 🚀
          </h2>
          <p className="text-gray-600">
            Each word learned brings you closer to mastering your target
            language.
          </p>
        </div>
      </div>
    </div>
  )
}
