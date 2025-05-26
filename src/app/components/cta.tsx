import Link from "next/link";

export default function CTA() {
  return (
    <>
      <div className="w-full px-4 sm:px-6 md:px-8 py-8">
        <section className="border border-border bg-secondary rounded-lg py-8 sm:py-12 px-4 sm:px-6 md:px-10 w-full max-w-4xl mx-auto text-center shadow-md">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black mb-4 leading-tight">
            <span>Send files</span>, <span className="text-accent">fast</span> and <span className="text-accent">secure</span> — <span className="text-accent">no account needed</span>.
          </h1>

          <p className="text-sm sm:text-base text-muted-text mb-6 sm:mb-8 max-w-2xl mx-auto">
            Share files instantly with a link or QR code. Protect them with passwords, expiry dates, or one-time access. Simple, secure, and private.
          </p>

          <div className="flex flex-col xs:flex-row gap-3 sm:gap-4 justify-center">
            <Link href={'/upload'} className="button-accent py-2 sm:py-3 px-4 sm:px-6 rounded-md font-medium hover:opacity-90 transition-opacity text-sm sm:text-base">
              Upload & Share Now
            </Link>

            <Link href={'/sign-up'} className="button py-2 sm:py-3 px-4 sm:px-6 rounded-md font-medium hover:opacity-90 transition-opacity text-sm sm:text-base">
              Sign Up for More
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
