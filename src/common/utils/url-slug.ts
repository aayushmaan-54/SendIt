import adjectives from "@/common/data/adjectives.json";
import nouns from "@/common/data/nouns.json";
import { customAlphabet } from 'nanoid';
import slugify from 'slugify';



const generateSuffix = customAlphabet('1234567890', 2);


function getRandomItem(list: string[]): string {
  return list[Math.floor(Math.random() * list.length)];
}


export function generateFriendlySlug(): string {
  const adjective = slugify(getRandomItem(adjectives), {
    lower: true,
    strict: true,
  });

  const noun = slugify(getRandomItem(nouns), {
    lower: true,
    strict: true,
  });

  const suffix = generateSuffix();
  return `${adjective}-${noun}-${suffix}`;
}


export function getOrCreateSlug(input?: string): string {
  if (input && input.trim()) {
    return slugify(input, { lower: true, strict: true });
  }

  return generateFriendlySlug();
}
