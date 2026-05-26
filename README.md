# babymo-canon

Sumber rujukan internal Baby Mo untuk **doa, hadis, dan ayat**. Statis,
tanpa backend, dikelola sepenuhnya melalui Git.

## Stack

Vite • React • TypeScript • Tailwind CSS • Zod • Fuse.js

## Skrip

| Perintah                 | Fungsi                                                       |
| ------------------------ | ------------------------------------------------------------ |
| `npm run dev`            | Jalankan dev server (mobile-first preview).                  |
| `npm run build`          | Build statis untuk GitHub Pages (`/babymo-canon/`).          |
| `npm run preview`        | Pratinjau hasil build.                                       |
| `npm run typecheck`      | Cek tipe TypeScript di seluruh proyek.                       |
| `npm run lint`           | ESLint.                                                      |
| `npm run validate:canon` | Validasi semua JSON kanon dengan Zod (exit ≠ 0 jika gagal).  |

## Aturan Keamanan Religius

- **Jangan pernah** mengarang teks Arab, rujukan, atau grading hadis.
- Jika ragu, gunakan literal `"VERIFIKASI"` pada field tersebut.
- Entri baru wajib `verification.status = "needs_review"`.
- Hanya entri `verified` yang dianggap kanonik.
