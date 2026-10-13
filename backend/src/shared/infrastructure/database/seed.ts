import bcrypt from 'bcrypt';
import { UserOrmEntity } from '../../../modules/identity/infrastructure/persistence/user.orm-entity.js';
import { CategoryOrmEntity } from '../../../modules/tenants/infrastructure/persistence/category.orm-entity.js';
import { TenantOrmEntity } from '../../../modules/tenants/infrastructure/persistence/tenant.orm-entity.js';
import { MallEventOrmEntity } from '../../../modules/events/infrastructure/persistence/mall-event.orm-entity.js';
import { SearchLogOrmEntity } from '../../../modules/analytics/infrastructure/persistence/search-log.orm-entity.js';
import { SearchQueryOrmEntity } from '../../../modules/analytics/infrastructure/persistence/search-query.orm-entity.js';
import { newId } from '../../domain/id.js';
import dataSource from './data-source.js';
import { buildSampleSearchHistory } from './seeds/sample-search-history.js';

const CATEGORIES = [
  { nameEn: 'Fashion', nameKm: 'ម៉ូដ' },
  { nameEn: 'Food & Beverage', nameKm: 'អាហារ និងភេសជ្ជៈ' },
  { nameEn: 'Pharmacy', nameKm: 'ឱសថស្ថាន' },
  { nameEn: 'Electronics', nameKm: 'គ្រឿងអេឡិចត្រូនិក' },
  { nameEn: 'Entertainment', nameKm: 'កម្សាន្ត' },
  { nameEn: 'Services', nameKm: 'សេវាកម្ម' },
];

interface TenantSeed {
  nameEn: string;
  nameKm: string;
  categoryNameEn: string;
  descriptionEn: string;
  descriptionKm: string;
  floor: number;
  openTime: string;
  closeTime: string;
}

const TENANTS: TenantSeed[] = [
  {
    nameEn: 'Zara',
    nameKm: 'ហ្សារ៉ា',
    categoryNameEn: 'Fashion',
    descriptionEn: 'Contemporary clothing, accessories, and shoes for men, women, and kids.',
    descriptionKm: 'សម្លៀកបំពាក់ គ្រឿងតុបតែង និងស្បែកជើងទាន់សម័យសម្រាប់បុរស ស្ត្រី និងកុមារ។',
    floor: 1,
    openTime: '09:00',
    closeTime: '22:00',
  },
  {
    nameEn: 'H&M',
    nameKm: 'អេច អេន អិម',
    categoryNameEn: 'Fashion',
    descriptionEn: 'Fast-fashion clothing and everyday essentials for the entire family.',
    descriptionKm: 'សម្លៀកបំពាក់ទាន់សម័យ និងតម្រូវការប្រចាំថ្ងៃសម្រាប់ក្រុមគ្រួសារទាំងមូល។',
    floor: 1,
    openTime: '09:00',
    closeTime: '22:00',
  },
  {
    nameEn: 'Uniqlo',
    nameKm: 'យូនីក្លូ',
    categoryNameEn: 'Fashion',
    descriptionEn: 'Casual wear inspired by Japanese values of simplicity, quality, and longevity.',
    descriptionKm: 'សម្លៀកបំពាក់បែបសាមញ្ញ គុណភាពខ្ពស់ និងប្រើប្រាស់បានយូរតាមបែបជប៉ុន។',
    floor: 2,
    openTime: '09:00',
    closeTime: '22:00',
  },
  {
    nameEn: 'Nike Store',
    nameKm: 'ហាង ណៃគី',
    categoryNameEn: 'Fashion',
    descriptionEn: 'Athletic footwear, workout apparel, and performance gear.',
    descriptionKm: 'ស្បែកជើងកីឡា សម្លៀកបំពាក់ហាត់ប្រាណ និងសម្ភារៈកីឡាគុណភាពខ្ពស់។',
    floor: 2,
    openTime: '09:00',
    closeTime: '21:30',
  },
  {
    nameEn: 'Charles & Keith',
    nameKm: 'ឆាលស៍ អេន ឃីត',
    categoryNameEn: 'Fashion',
    descriptionEn: 'Stylish women footwear, handbags, and lifestyle fashion accessories.',
    descriptionKm: 'ស្បែកជើងស្ត្រី កាបូប និងគ្រឿងតុបតែងម៉ូដទាន់សម័យ។',
    floor: 1,
    openTime: '10:00',
    closeTime: '21:00',
  },
  {
    nameEn: 'Starbucks Coffee',
    nameKm: 'ស្តាបាក់ កាហ្វេ',
    categoryNameEn: 'Food & Beverage',
    descriptionEn: 'Handcrafted espresso beverages, cold brews, teas, and pastries.',
    descriptionKm: 'កាហ្វេប្រណិត ភេសជ្ជៈស្រស់ស្រាយ តែ និងនំយ៉ាងច្រើនប្រភេទ។',
    floor: 1,
    openTime: '07:00',
    closeTime: '22:00',
  },
  {
    nameEn: 'Brown Coffee and Bakery',
    nameKm: 'ប្រោន កាហ្វេ',
    categoryNameEn: 'Food & Beverage',
    descriptionEn: 'Locally roasted specialty coffee, artisan bakery, and breakfast items.',
    descriptionKm: 'កាហ្វេពិសេសលីងក្នុងស្រុក នំដុតថ្មីៗ និងអាហារពេលព្រឹក។',
    floor: 1,
    openTime: '07:00',
    closeTime: '21:30',
  },
  {
    nameEn: 'Bonchon Chicken',
    nameKm: 'ប៊ុនឈុន មាន់បំពង',
    categoryNameEn: 'Food & Beverage',
    descriptionEn: 'Crispy Korean fried chicken glazed in signature soy garlic or spicy sauce.',
    descriptionKm: 'សាច់មាន់បំពងបែបកូរ៉េស្រួយឆ្ងាញ់ ជាមួយទឹកជ្រលក់រសជាតិដើម។',
    floor: 3,
    openTime: '10:00',
    closeTime: '22:00',
  },
  {
    nameEn: 'Koi Thé',
    nameKm: 'កយ ថេ',
    categoryNameEn: 'Food & Beverage',
    descriptionEn: 'Freshly brewed bubble milk tea, golden pearls, and macchiato drinks.',
    descriptionKm: 'តែទឹកដោះគោគុជស្រស់ គុជមាស និងភេសជ្ជៈម៉ាគីយ៉ាតូ។',
    floor: 2,
    openTime: '09:00',
    closeTime: '21:30',
  },
  {
    nameEn: 'Shabushi Buffet',
    nameKm: 'សាប៊ូស៊ី ប៊ូហ្វេ',
    categoryNameEn: 'Food & Beverage',
    descriptionEn: 'All-you-can-eat Japanese shabu-shabu conveyor belt and sushi bar.',
    descriptionKm: 'ប៊ូហ្វេស៊ុបបែបជប៉ុនលើខ្សែពាន និងស៊ូស៊ីគ្រប់មុខ។',
    floor: 3,
    openTime: '10:30',
    closeTime: '22:00',
  },
  {
    nameEn: 'Apple Store (iOne)',
    nameKm: 'អាយវ័ន (Apple)',
    categoryNameEn: 'Electronics',
    descriptionEn: 'Authorized Apple products, iPhones, iPads, Macs, and genuine accessories.',
    descriptionKm: 'ផលិតផលផ្លូវការរបស់ Apple រួមមាន iPhone, iPad, Mac និងគ្រឿងបន្លាស់សុទ្ធ។',
    floor: 2,
    openTime: '09:00',
    closeTime: '22:00',
  },
  {
    nameEn: 'Samsung Experience Store',
    nameKm: 'សាមសុង អិចស្ពៀរៀន',
    categoryNameEn: 'Electronics',
    descriptionEn: 'Flagship Galaxy smartphones, tablets, wearables, and ecosystem displays.',
    descriptionKm: 'ទូរស័ព្ទ Galaxy ថេប្លេត នាឡិកាឆ្លាតវៃ និងគ្រឿងអេឡិចត្រូនិកទំនើប។',
    floor: 2,
    openTime: '09:00',
    closeTime: '21:30',
  },
  {
    nameEn: 'Xiaomi Store',
    nameKm: 'ស៊ាវមី ស្ត័រ',
    categoryNameEn: 'Electronics',
    descriptionEn: 'Smart home IoT gadgets, smart televisions, robot vacuums, and phones.',
    descriptionKm: 'ឧបករណ៍ផ្ទះឆ្លាតវៃ ទូរទស្សន៍ ម៉ាស៊ីនបោសផ្ទះស្វ័យប្រវត្តិ និងទូរស័ព្ទដៃ។',
    floor: 2,
    openTime: '09:00',
    closeTime: '21:30',
  },
  {
    nameEn: 'Guardian Health & Beauty',
    nameKm: 'ហ្កាឌៀន សុខភាព និងសម្ផស្ស',
    categoryNameEn: 'Pharmacy',
    descriptionEn: 'Pharmacy, vitamins, skincare, cosmetics, and personal care products.',
    descriptionKm: 'ឱសថស្ថាន វីតាមីន ផលិតផលថែរក្សាស្បែក គ្រឿងសម្អាង និងការថែទាំផ្ទាល់ខ្លួន។',
    floor: 1,
    openTime: '09:00',
    closeTime: '22:00',
  },
  {
    nameEn: 'UCare Pharmacy',
    nameKm: 'យូឃែរ ឱសថស្ថាន',
    categoryNameEn: 'Pharmacy',
    descriptionEn: 'Prescription medicines, certified pharmacists, health supplements, and organic body care.',
    descriptionKm: 'ថ្នាំពេទ្យតាមវេជ្ជបញ្ជា ឱសថការីជំនាញ អាហារបំប៉នសុខភាព និងផលិតផលធម្មជាតិ។',
    floor: 1,
    openTime: '08:30',
    closeTime: '22:00',
  },
  {
    nameEn: 'Major Cineplex',
    nameKm: 'មេជ័រ ស៊ីណេផ្លិច',
    categoryNameEn: 'Entertainment',
    descriptionEn: 'Multi-screen cinema with IMAX, 4DX, VIP lounges, and fresh popcorn.',
    descriptionKm: 'រោងភាពយន្តស្តង់ដារអន្តរជាតិ IMAX, 4DX និងបន្ទប់ VIP ប្រណិត។',
    floor: 4,
    openTime: '09:00',
    closeTime: '23:30',
  },
  {
    nameEn: 'Kids City Play Zone',
    nameKm: 'ឃីដស៊ីធី កន្លែងក្មេងលេង',
    categoryNameEn: 'Entertainment',
    descriptionEn: 'Indoor playground, climbing wall, and toddler soft play area.',
    descriptionKm: 'សួនកម្សាន្តកុមារក្នុងម្លប់ កន្លែងឡើងជញ្ជាំង និងកន្លែងលេងសុវត្ថិភាព។',
    floor: 4,
    openTime: '09:00',
    closeTime: '20:30',
  },
  {
    nameEn: 'ABA Bank Branch & ATMs',
    nameKm: 'ធនាគារ អេប៊ីអេ',
    categoryNameEn: 'Services',
    descriptionEn: 'Full banking services, cash deposit machines, currency exchange, and 24/7 ATMs.',
    descriptionKm: 'សេវាធនាគារពេញលេញ ម៉ាស៊ីនដាក់ប្រាក់ ប្តូរប្រាក់ និងទូ ATM ២៤ម៉ោង។',
    floor: 1,
    openTime: '08:00',
    closeTime: '20:00',
  },
];

interface EventSeed {
  titleEn: string;
  titleKm: string;
  descriptionEn: string;
  descriptionKm: string;
  startDate: string;
  endDate: string;
}

const EVENTS: EventSeed[] = [
  {
    titleEn: 'Grand Autumn Shopping Festival',
    titleKm: 'ពិធីបុណ្យទិញទំនិញរដូវស្លឹកឈើជ្រុះដ៏ធំ',
    descriptionEn: 'Enjoy up to 50% discount on top brands across fashion and electronics with live music performances.',
    descriptionKm: 'រីករាយជាមួយការបញ្ចុះតម្លៃរហូតដល់ ៥០% លើម៉ាកល្បីៗ និងការប្រគំតន្ត្រីផ្ទាល់។',
    startDate: '2026-10-01',
    endDate: '2026-10-31',
  },
  {
    titleEn: 'Khmer Food & Dessert Fair',
    titleKm: 'ពិព័រណ៍ម្ហូប និងបង្អែមខ្មែរ',
    descriptionEn: 'Explore authentic Cambodian street food, regional delicacies, and artisan desserts at the central atrium.',
    descriptionKm: 'ភ្លក្សរសជាតិម្ហូបខ្មែរបុរាណ អាហារតាមតំបន់ និងបង្អែមប្លែកៗនៅសាលកណ្តាលផ្សារ។',
    startDate: '2026-10-10',
    endDate: '2026-10-25',
  },
  {
    titleEn: 'Next-Gen Tech & Gadget Expo',
    titleKm: 'ពិព័រណ៍បច្ចេកវិទ្យា និងឧបករណ៍ទំនើប',
    descriptionEn: 'Hands-on showcase of the latest smart devices, AI gadgets, gaming setups, and exclusive launch offers.',
    descriptionKm: 'ទស្សនា និងសាកល្បងឧបករណ៍ឆ្លាតវៃចុងក្រោយ បច្ចេកវិទ្យា AI និងការបញ្ចុះតម្លៃពិសេស។',
    startDate: '2026-11-01',
    endDate: '2026-11-15',
  },
  {
    titleEn: 'Kids Weekend Costume Carnival',
    titleKm: 'ក្បួនដង្ហែកុមារ និងតុក្កតាចុងសប្តាហ៍',
    descriptionEn: 'Fun games, face painting, mascot meet-and-greets, and gift giveaways for children of all ages.',
    descriptionKm: 'ល្បែងកម្សាន្តសប្បាយៗ គូរគំនូរលើមុខ ជួបតុក្កតា និងការចែកកាដូឥតគិតថ្លៃសម្រាប់កុមារ។',
    startDate: '2026-11-20',
    endDate: '2026-11-22',
  },
  {
    titleEn: 'Summer Clearance Sale',
    titleKm: 'ការលក់បញ្ចុះតម្លៃពិសេសបិទរដូវក្តៅ',
    descriptionEn: 'Clearance sale with unbeatable deals on previous season collections.',
    descriptionKm: 'ការលក់បញ្ចុះតម្លៃពិសេសបោសសម្អាតស្តុកសម្រាប់ម៉ូដរដូវក្តៅ។',
    startDate: '2026-08-01',
    endDate: '2026-08-31',
  },
];

async function seed(): Promise<void> {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be set');
  }

  await dataSource.initialize();
  try {
    const categoriesRepo = dataSource.getRepository(CategoryOrmEntity);
    const categoryMap = new Map<string, string>();

    for (const category of CATEGORIES) {
      let existing = await categoriesRepo.findOneBy({ nameEn: category.nameEn });
      if (!existing) {
        const id = newId();
        await categoriesRepo.insert({ id, ...category });
        categoryMap.set(category.nameEn, id);
      } else {
        categoryMap.set(category.nameEn, existing.id);
      }
    }

    const usersRepo = dataSource.getRepository(UserOrmEntity);
    if (!(await usersRepo.existsBy({ email }))) {
      await usersRepo.insert({
        id: newId(),
        email,
        password: await bcrypt.hash(password, 10),
        role: 'admin',
      });
    }

    const tenantsRepo = dataSource.getRepository(TenantOrmEntity);
    for (const tenant of TENANTS) {
      const categoryId = categoryMap.get(tenant.categoryNameEn);
      if (!categoryId) continue;

      const exists = await tenantsRepo.existsBy({ nameEn: tenant.nameEn });
      if (!exists) {
        await tenantsRepo.insert({
          id: newId(),
          nameEn: tenant.nameEn,
          nameKm: tenant.nameKm,
          descriptionEn: tenant.descriptionEn,
          descriptionKm: tenant.descriptionKm,
          floor: tenant.floor,
          openTime: tenant.openTime,
          closeTime: tenant.closeTime,
          categoryId,
        });
      }
    }

    const eventsRepo = dataSource.getRepository(MallEventOrmEntity);
    for (const event of EVENTS) {
      const exists = await eventsRepo.existsBy({ titleEn: event.titleEn });
      if (!exists) {
        await eventsRepo.insert({
          id: newId(),
          titleEn: event.titleEn,
          titleKm: event.titleKm,
          descriptionEn: event.descriptionEn,
          descriptionKm: event.descriptionKm,
          startDate: event.startDate,
          endDate: event.endDate,
        });
      }
    }

    if (process.env.SEED_SAMPLE_SEARCH_HISTORY !== 'false') {
      const queriesRepo = dataSource.getRepository(SearchQueryOrmEntity);
      const logsRepo = dataSource.getRepository(SearchLogOrmEntity);
      const hasHistory = (await queriesRepo.count()) > 0 || (await logsRepo.count()) > 0;

      if (hasHistory) {
        console.log('Search history already exists, skipping the sample search history.');
      } else {
        const tenants = await tenantsRepo.find({
          select: { id: true, nameEn: true, nameKm: true },
        });
        const history = buildSampleSearchHistory({ now: new Date(), tenants });

        await queriesRepo.insert(
          history.queries.map((query) => ({
            id: newId(),
            term: query.term,
            resultCount: query.resultCount,
            createdAt: query.createdAt,
          })),
        );
        await logsRepo.insert(
          history.storeViews.map((view) => ({
            id: newId(),
            tenantId: view.tenantId,
            query: view.query,
            createdAt: view.createdAt,
          })),
        );
        console.log(
          `Added ${history.queries.length} sample searches and ${history.storeViews.length} sample store views.`,
        );
      }
    }

    console.log('Database seed completed successfully!');
  } finally {
    await dataSource.destroy();
  }
}

await seed();
