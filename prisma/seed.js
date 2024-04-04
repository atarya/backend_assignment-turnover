import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

//Had to use multiple faker methods as the list wasn't reaching 100 entries
const fakerMethods = [
  () => faker.commerce.product(),
  () => faker.commerce.productMaterial(),
  () => faker.commerce.department(),
  () => faker.commerce.productAdjective(),
  () => faker.location.country()
];

//Randomly choosing a faker method
const generateUniqueCategoryName = () => {
  const methodIndex = Math.floor(Math.random() * fakerMethods.length);
  return fakerMethods[methodIndex]();
};

//Generating a random category
const generateUniqueCategories = async (totalCategories) => {
  const categoriesSet = new Set(); //Using set to avoid duplicates

  while (categoriesSet.size < totalCategories) {
    const categoryName = generateUniqueCategoryName();
    categoriesSet.add(categoryName);
  }

  return Array.from(categoriesSet).map(name => ({ name }));
};

//Saving in postgres DB
const main = async () => {
  try {
    const categories = await generateUniqueCategories(100);
    await prisma.category.createMany({
      data: categories,
      skipDuplicates: true,
    });
    console.log('Successfully inserted 100 categories.');
  } catch (error) {
    console.error('Failed to insert categories:', error);
  } finally {
    await prisma.$disconnect();
  }
};

main();
