import leoProfanity from 'leo-profanity'

export const initProfanity = () => {
  const russianDictionary = leoProfanity.getDictionary('ru')
  leoProfanity.add(russianDictionary)
  const englishDictionary = leoProfanity.getDictionary('en')
  leoProfanity.add(englishDictionary)
}

export const cleanText = (text) => {
  if (typeof text !== 'string') return text
  return leoProfanity.clean(text)
}

export const hasProfanity = (text) => {
  if (typeof text !== 'string') return false
  return leoProfanity.check(text)
}
