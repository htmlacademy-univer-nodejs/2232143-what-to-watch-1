export const GENRE_ARRAY = ['Comedy', 'Crime', 'Documentary', 'Drama', 'Horror', 'Family', 'Romance', 'Scifi', 'Thriller'];

export type TGenre = typeof GENRE_ARRAY[number];

export function getGenre(value: string): TGenre | never {
  if (!GENRE_ARRAY.includes(value)) {
    throw new Error(`Unrecognised genre: ${value}.`);
  }
  return value;
}
