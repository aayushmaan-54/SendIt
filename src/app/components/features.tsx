export default function Features() {
  const featuresData = [
    {
      icon: "📁",
      heading: "Effortless File Uploads",
      description: "Drag & drop or select files to upload instantly.",
    },
    {
      icon: "🔗",
      heading: "Instant Link Generation",
      description: "Create normal (7-char), friendly (adjective-noun), or custom links.",
    },
    {
      icon: "📷",
      heading: "QR Code Sharing",
      description: "Share files quickly via scannable QR codes.",
    },
    {
      icon: "⏳",
      heading: "File Expiry Control",
      description: "Auto-expire by time, download count, or one-time access.",
    },
    {
      icon: "🔒",
      heading: "Advanced File Protection",
      description: "Public, password, email-auth (for users), or OTP-based access.",
    },
  ]

  return (
    <section className="w-full py-8 mt-10 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {featuresData.map((feature, idx) => (
            <div
              key={idx}
              className="bg-tertiary shadow-md rounded-lg p-3 border border-border hover:shadow-lg transition flex flex-col min-h-[180px] w-full overflow-hidden"
            >
              <div className="text-2xl bg-tertiary-secondary size-12 flex items-center justify-center rounded-md mb-3 flex-shrink-0">
                {feature.icon}
              </div>
              <h3 className="text-base font-semibold mb-1 text-primary-text break-words">{feature.heading}</h3>
              <p className="text-sm text-muted-text break-words">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
