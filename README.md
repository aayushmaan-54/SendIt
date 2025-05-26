# SendIt 📤
A powerful, privacy-focused file sharing app — effortlessly upload, share, protect, and track your files with complete control.

---

## ✨ Features
- 📁 **Effortless File Uploads** –   Drag & drop or select files to upload instantly with a smooth, responsive interface.
- 🔗 **Instant Link Generation**
  Share files via:
  - **Normal links** – Random 7-character string
  - **Friendly links** – Auto-generated using adjectives + nouns + numbers
  - **Custom links** – Choose your own slug (validated and checked for availability)
- 📷 **QR Code Sharing** –   Instantly generate a QR code for any file link to share effortlessly across devices.
- ⏳ **File Expiry Control**
  Keep your files temporary with:
  - **Time-based expiry** – Auto-deletes after a set duration
  - **Download limits** – File is removed after set number of downloads
  - **One-time access** – Deleted right after the first successful access
- 🔒 **Advanced File Protection**
  Choose how securely your files are accessed:
  - **Public** – Anyone with the link can access
  - **Password-protected** – Recipient must enter a shared password
  - **Email-protected** – Only logged-in authorized users (approved by sender) can access
  - **OTP-protected** – File access granted via one-time password sent to the recipient’s email (no login required)

---

## 🛠️ Tech Stack
- **Fullstack Framework:** [Next.js](https://nextjs.org/) (App Router, Server Actions)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Forms & Validation:** [Conform](https://conform.guide/) + [Zod](https://zod.dev/)
- **Data Fetching:** [TanStack React Query](https://tanstack.com/query/latest), [Axios](https://axios-http.com/)
- **Authentication:** [BetterAuth](https://www.better-auth.com/)
- **Email Service:** [SendGrid](https://sendgrid.com/) + [React Email](https://react.email/)
- **Database & ORM:** [PostgreSQL](https://www.postgresql.org/) + [Drizzle ORM](https://orm.drizzle.team/) + [Neon](https://neon.tech/)
- **File Storage:** [UploadThing](https://uploadthing.com/)
- **Scheduled Tasks:** [Vercel CRON Jobs](https://vercel.com/docs/cron-jobs)
- **Notifications:** [React Hot Toast](https://react-hot-toast.com/)
- **Utilities & Helpers:**
  - [jszip](https://stuk.github.io/jszip/) (Zip/unzip files client-side)
  - [nanoid](https://zelark.github.io/nano-id-cc/) (Unique ID generation)
  - [next-qrcode](https://next-qrcode.js.org) (Generate QR codes in Next.js)
  - [slugify](https://github.com/simov/slugify) (Create URL-friendly slugs)

---

## 📝 License
This project is licensed under the MIT License.
© SendIt, 2025
