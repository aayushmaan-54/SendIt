import Link from "next/link";


export default function Hero() {
  return (
    <>
      <section className="mt-28 flex flex-col items-center justify-center">
        <h1 className="text-6xl md:text-8xl font-black flex flex-col items-center justify-center">
          <span className="text-7xl md:text-9xl">📤</span>
          <span className="italic mt-3">SendIt</span>
        </h1>

        <p className="mt-2 text-muted-text font-bold mb-5 text-base md:text-xl">Secure, Instant File Sharing</p>

        <Link href="/" className="button-accent">
          Get Started
        </Link>
      </section>
    </>
  );
}
