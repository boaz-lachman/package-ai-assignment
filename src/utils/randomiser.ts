export const getRandomItem = <T>(items: T[]): T => {
    if (items.length === 0) {
      throw new Error('Array cannot be empty');
    }

    const randomIndex = Math.floor(Math.random() * items.length);
    return items[randomIndex];
  }
