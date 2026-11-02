import type { ProjectNamePart } from "../lib/directory";

export default function ProjectName({ name }: { name: string | ProjectNamePart[] }) {
  const parts = typeof name === "string" ? [{ text: name }] : name;
  return (
    <>
      {parts.map((part, index) =>
        part.italic ? <i key={index}>{part.text}</i> : part.text,
      )}
    </>
  );
}
