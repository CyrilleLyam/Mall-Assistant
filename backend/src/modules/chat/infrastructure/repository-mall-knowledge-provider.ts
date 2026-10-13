import { Injectable } from '@nestjs/common';
import { Clock } from '../../../shared/application/clock.js';
import { MallEventRepository } from '../../events/domain/mall-event.repository.js';
import { CategoryRepository } from '../../tenants/domain/category.repository.js';
import { TenantRepository } from '../../tenants/domain/tenant.repository.js';
import { MallKnowledgeProvider } from '../application/ports/mall-knowledge-provider.js';
import {
  EventFact,
  MallKnowledge,
  StoreFact,
} from '../domain/mall-knowledge.js';

const EVENT_INTENT = /promo|event|sale|discount|offer|promotion|កម្មវិធី|បញ្ចុះតម្លៃ/i;
const GREETING_INTENT = /^(hi|hello|hey|good\s*(morning|afternoon|evening)|suostei|choum reap sour|សួស្តី|ជំរាបសួរ)[\s!.,?]*$/i;
const FLOOR_PATTERN = /(?:floor|level|ជាន់(?:\s*ទី)?)\s*([1-9])/i;
const ORDINAL_FLOOR_PATTERN = /([1-9])(?:st|nd|rd|th)\s*floor/i;

const MIN_TERM_LENGTH = 3;
const MAX_STORES = 10;
const MAX_EVENTS = 10;
const STOP_WORDS = new Set([
  'the', 'and', 'for', 'with', 'where', 'what', 'when', 'which', 'how',
  'are', 'can', 'you', 'does', 'there', 'any', 'store', 'stores', 'shop',
  'shops', 'mall', 'find', 'show', 'tell', 'open', 'hours', 'floor',
]);

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  'Fashion': [
    'cloth', 'clothes', 'clothing', 'apparel', 'shoe', 'shoes', 'footwear',
    'bag', 'bags', 'dress', 'shirt', 'pants', 'wear', 'jacket', 'jean', 'jeans',
    'fashion', 'outfit', 'ខោ', 'អាវ', 'ស្បែកជើង', 'កាបូប', 'ម៉ូដ',
  ],
  'Food & Beverage': [
    'food', 'drink', 'drinks', 'beverage', 'beverages', 'coffee', 'tea',
    'eat', 'dinner', 'lunch', 'breakfast', 'meal', 'cafe', 'restaurant',
    'snack', 'chicken', 'buffet', 'burger', 'pizza', 'បាយ', 'ញ៉ាំ', 'កាហ្វេ',
    'តែ', 'អាហារ', 'ភេសជ្ជៈ',
  ],
  'Pharmacy': [
    'pharmacy', 'medicine', 'drug', 'drugs', 'health', 'vitamin', 'vitamins',
    'skincare', 'cosmetic', 'cosmetics', 'medical', 'care', 'ថ្នាំ', 'ពេទ្យ',
    'សុខភាព', 'សម្រស់', 'ឱសថ',
  ],
  'Electronics': [
    'electronic', 'electronics', 'phone', 'phones', 'gadget', 'gadgets',
    'tech', 'technology', 'laptop', 'computer', 'apple', 'iphone', 'ipad',
    'samsung', 'xiaomi', 'device', 'ទូរស័ព្ទ', 'កុំព្យូទ័រ', 'គ្រឿងអេឡិចត្រូនិក',
  ],
  'Entertainment': [
    'entertainment', 'cinema', 'movie', 'movies', 'film', 'films',
    'theater', 'theatre', 'arcade', 'game', 'games', 'bowling', 'play',
    'kids', 'កុន', 'ភាពយន្ត', 'កម្សាន្ត', 'លេង',
  ],
  'Services': [
    'service', 'services', 'bank', 'banking', 'atm', 'atms', 'money',
    'cash', 'hair', 'salon', 'haircut', 'laundry', 'clean', 'cleaning',
    'ធនាគារ', 'លុយ', 'កាត់សក់', 'សេវាកម្ម',
  ],
};

const extractTerms = (text: string): string[] =>
  text
    .split(/[^\p{L}\p{M}\p{N}]+/u)
    .filter((term) => term.length >= MIN_TERM_LENGTH && !STOP_WORDS.has(term));

@Injectable()
export class RepositoryMallKnowledgeProvider extends MallKnowledgeProvider {
  constructor(
    private readonly tenants: TenantRepository,
    private readonly categories: CategoryRepository,
    private readonly events: MallEventRepository,
    private readonly clock: Clock,
  ) {
    super();
  }

  async gather(question: string): Promise<MallKnowledge> {
    const today = this.clock.today();
    const [tenants, categories, events] = await Promise.all([
      this.tenants.search({}),
      this.categories.findAll(),
      this.events.list({ today }),
    ]);

    const lowered = question.toLowerCase();
    const isGreeting = GREETING_INTENT.test(lowered.trim());

    // If it's a friendly greeting, provide mall highlights so the LLM can greet helpfully
    if (isGreeting) {
      const highlightedStores: StoreFact[] = tenants.slice(0, 5).map(({ props }) => {
        const cat = categories.find((c) => c.id === props.categoryId);
        return {
          nameEn: props.nameEn,
          nameKm: props.nameKm,
          categoryEn: cat?.nameEn ?? '',
          categoryKm: cat?.nameKm ?? '',
          descriptionEn: props.descriptionEn,
          descriptionKm: props.descriptionKm,
          floor: props.floor,
          opensAt: props.openingHours.open,
          closesAt: props.openingHours.close,
        };
      });

      const activeEvents: EventFact[] = [];
      for (const e of events) {
        const status = e.props.period.statusOn(today);
        if (status !== 'past') {
          activeEvents.push({
            titleEn: e.props.titleEn,
            titleKm: e.props.titleKm,
            descriptionEn: e.props.descriptionEn,
            descriptionKm: e.props.descriptionKm,
            startDate: e.props.period.startDate,
            endDate: e.props.period.endDate,
            status,
          });
        }
        if (activeEvents.length >= 3) break;
      }

      return new MallKnowledge(highlightedStores, activeEvents);
    }

    const terms = extractTerms(lowered);
    const mentions = (text: string): boolean => {
      const candidate = text.toLowerCase();
      return (
        candidate.length > 0 &&
        (lowered.includes(candidate) ||
          terms.some((term) => candidate.includes(term)))
      );
    };

    const categoryById = new Map(
      categories.map((category) => [category.id, category]),
    );

    const mentionedCategoryIds = new Set(
      categories
        .filter((c) => mentions(c.nameEn) || mentions(c.nameKm))
        .map((c) => c.id),
    );

    // Expand category matching via common synonyms and keywords (e.g. clothes -> Fashion)
    for (const [catName, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
      if (keywords.some((kw) => lowered.includes(kw) || terms.includes(kw))) {
        const cat = categories.find((c) => c.nameEn === catName);
        if (cat) {
          mentionedCategoryIds.add(cat.id);
        }
      }
    }

    // Check if a specific floor was requested (e.g., "floor 2", "2nd floor")
    const floorMatch =
      lowered.match(FLOOR_PATTERN) ?? lowered.match(ORDINAL_FLOOR_PATTERN);
    const targetFloor = floorMatch ? parseInt(floorMatch[1], 10) : null;

    const stores: StoreFact[] = tenants
      .filter(({ props }) => {
        if (targetFloor !== null && props.floor === targetFloor) {
          return true;
        }
        return (
          mentions(props.nameEn) ||
          mentions(props.nameKm) ||
          mentions(props.descriptionEn) ||
          mentions(props.descriptionKm) ||
          mentionedCategoryIds.has(props.categoryId)
        );
      })
      .slice(0, MAX_STORES)
      .map(({ props }) => ({
        nameEn: props.nameEn,
        nameKm: props.nameKm,
        categoryEn: categoryById.get(props.categoryId)?.nameEn ?? '',
        categoryKm: categoryById.get(props.categoryId)?.nameKm ?? '',
        descriptionEn: props.descriptionEn,
        descriptionKm: props.descriptionKm,
        floor: props.floor,
        opensAt: props.openingHours.open,
        closesAt: props.openingHours.close,
      }));

    const asksAboutEvents = EVENT_INTENT.test(question);
    const eventFacts: EventFact[] = [];
    for (const event of events) {
      const { period, ...props } = event.props;
      const status = period.statusOn(today);
      if (status === 'past') {
        continue;
      }
      const relevant =
        asksAboutEvents || mentions(props.titleEn) || mentions(props.titleKm) || mentions(props.descriptionEn);
      if (relevant) {
        eventFacts.push({
          ...props,
          startDate: period.startDate,
          endDate: period.endDate,
          status,
        });
      }
    }

    return new MallKnowledge(stores, eventFacts.slice(0, MAX_EVENTS));
  }
}
