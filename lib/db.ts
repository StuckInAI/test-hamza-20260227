import { AppDataSource } from '@/database/data-source';
import { CalculationHistory } from '@/database/entity/CalculationHistory';

export async function initializeDatabase() {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
}

export async function saveCalculation(calculation: string, result: string, category: string = 'Food & Drink') {
  await initializeDatabase();
  const history = new CalculationHistory();
  history.calculation = calculation;
  history.result = result;
  history.category = category;
  return await AppDataSource.manager.save(history);
}

export async function getHistory() {
  await initializeDatabase();
  return await AppDataSource.manager.find(CalculationHistory, {
    order: { createdAt: 'DESC' },
  });
}

export async function clearHistory() {
  await initializeDatabase();
  return await AppDataSource.manager.clear(CalculationHistory);
}