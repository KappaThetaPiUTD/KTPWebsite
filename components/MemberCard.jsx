import Image from "next/image";

// One member's photo card, shared by the Brothers and Alumni pages so the
// markup lives in a single place. Pass a `member` with { name, src, linkedin }
// and, for board members, an optional `position`.
export default function MemberCard({ member }) {
  return (
    <div className="w-32 sm:w-40 text-center">
      <div className="group relative w-32 h-40 sm:w-40 sm:h-52 mx-auto bg-gray-400 rounded-lg overflow-hidden transition-shadow duration-300 hover:shadow-xl">
        <Image
          src={member.src}
          alt={member.position ? `${member.name} - ${member.position}` : member.name}
          fill
          sizes="(max-width: 640px) 128px, 160px"
          quality={90}
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {member.linkedin && (
          <a
            href={member.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0"
            aria-label={`${member.name} LinkedIn profile`}
          />
        )}
      </div>
      <div className="mt-2">{member.name}</div>
      {member.position && (
        <div className="text-sm text-gray-400">{member.position}</div>
      )}
    </div>
  );
}
