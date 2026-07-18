# KTP Website Operations Index

Start here when maintaining the public website.

| Guide | Use it for |
| --- | --- |
| [SECURITY.md](SECURITY.md) | Credential rotation, access handoff, member-data rules, and incident response |
| [DEPLOYMENT.md](DEPLOYMENT.md) | Vercel, Node 24, environment files, deploy verification, and the July 2026 incident |
| [EVENTS.md](EVENTS.md) | Adding, viewing, hiding, and deleting recruitment events |
| [BIRTHDAYS.md](BIRTHDAYS.md) | Managing the home-page birthday banner |
| [CHATBOT.md](CHATBOT.md) | Gemini key, roster grounding, Supabase knowledge, and chatbot troubleshooting |

## Common code-managed updates

- Board officers: `lib/roster.js`
- Active members and pledge classes: `app/brothers/page.jsx`
- Alumni: `app/alumni/page.jsx`
- Company logos: `components/CompanyCollage.js`
- Gallery: `app/gallery/page.jsx`
- Recruitment form: `app/recruitment/form.jsx`
- President letter: `components/paragraphs.jsx`

## Safe change workflow

```powershell
git pull --ff-only origin main
git switch -c feature/short-description
npm install
npm run build
git diff
git add <changed-files>
git commit -m "Describe the change"
git push -u origin feature/short-description
```

Open a pull request, review its Vercel preview, then merge. Never commit `.env`,
API secrets, private member data, form exports, resumes, transcripts, schedules,
health details, or emergency contacts.

## Headshot helper

Copy `.env.example` to `.env`, add the Cloudinary variables locally, then:

```powershell
npm run upload-headshots -- "C:\Users\YourName\Downloads" --dry-run
npm run upload-headshots -- "C:\Users\YourName\Downloads"
```

Name each image exactly like the member's name on the site. Always use the dry
run first and review `git diff` before committing.
